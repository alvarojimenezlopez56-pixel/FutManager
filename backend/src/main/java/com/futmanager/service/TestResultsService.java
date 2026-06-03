package com.futmanager.service;

import org.springframework.stereotype.Service;
import java.io.File;
import java.util.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import java.time.Instant;

@Service
public class TestResultsService {

    public Map<String, Object> getTestResults() {
        Map<String, Object> results = new HashMap<>();
        
        // Buscar en los directorios estándares de reporte de surefire
        File reportsDir = new File("target/surefire-reports");
        if (!reportsDir.exists() || !reportsDir.isDirectory()) {
            reportsDir = new File("backend/target/surefire-reports");
        }

        if (!reportsDir.exists() || !reportsDir.isDirectory()) {
            // Datos de demostración y advertencia cuando aún no se han ejecutado los tests reales
            results.put("status", "NO_REPORTS");
            results.put("totalTests", 0);
            results.put("passed", 0);
            results.put("failed", 0);
            results.put("skipped", 0);
            results.put("executionTimeMs", 0);
            results.put("timestamp", Instant.now().toString());
            results.put("message", "No se encontraron reportes. Ejecute los tests unitarios primero (ej. ./mvnw test) para generar los resultados reales.");
            
            // Listado de pruebas planificadas
            List<Map<String, String>> mockTests = new ArrayList<>();
            mockTests.add(createTestInfo("testGuardarCartaValida", "CartaFUTServiceTest", "PENDIENTE"));
            mockTests.add(createTestInfo("testGuardarCartaConMediaFueraDeRangoSuperior", "CartaFUTServiceTest", "PENDIENTE"));
            mockTests.add(createTestInfo("testGuardarCartaConMediaFueraDeRangoInferior", "CartaFUTServiceTest", "PENDIENTE"));
            mockTests.add(createTestInfo("testGuardarCartaConEstadisticasInvalidas", "CartaFUTServiceTest", "PENDIENTE"));
            mockTests.add(createTestInfo("testBuscarCartaPorIdExistente", "CartaFUTIntegrationTest", "PENDIENTE"));
            mockTests.add(createTestInfo("testEliminarCarta", "CartaFUTIntegrationTest", "PENDIENTE"));
            results.put("tests", mockTests);
            return results;
        }

        File[] xmlFiles = reportsDir.listFiles((dir, name) -> name.startsWith("TEST-") && name.endsWith(".xml"));
        if (xmlFiles == null || xmlFiles.length == 0) {
            results.put("status", "NO_REPORTS");
            results.put("totalTests", 0);
            results.put("passed", 0);
            results.put("failed", 0);
            results.put("skipped", 0);
            results.put("executionTimeMs", 0);
            results.put("timestamp", Instant.now().toString());
            results.put("message", "No se encontraron archivos XML en surefire-reports.");
            return results;
        }

        int totalTests = 0;
        int failed = 0;
        int skipped = 0;
        double totalTime = 0.0;
        List<Map<String, String>> testsList = new ArrayList<>();

        try {
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            dbFactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true); // Proteger contra XXE
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();

            for (File file : xmlFiles) {
                try {
                    Document doc = dBuilder.parse(file);
                    doc.getDocumentElement().normalize();

                    Element root = doc.getDocumentElement();
                    
                    int fileTests = Integer.parseInt(root.getAttribute("tests"));
                    int fileFailures = Integer.parseInt(root.getAttribute("failures"));
                    int fileErrors = root.hasAttribute("errors") ? Integer.parseInt(root.getAttribute("errors")) : 0;
                    int fileSkipped = root.hasAttribute("skipped") ? Integer.parseInt(root.getAttribute("skipped")) : 0;
                    double fileTime = root.hasAttribute("time") ? Double.parseDouble(root.getAttribute("time")) : 0.0;

                    totalTests += fileTests;
                    failed += (fileFailures + fileErrors);
                    skipped += fileSkipped;
                    totalTime += fileTime;

                    NodeList nList = doc.getElementsByTagName("testcase");
                    for (int temp = 0; temp < nList.getLength(); temp++) {
                        Node nNode = nList.item(temp);
                        if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                            Element eElement = (Element) nNode;
                            String name = eElement.getAttribute("name");
                            String classname = eElement.getAttribute("classname");
                            if (classname.contains(".")) {
                                classname = classname.substring(classname.lastIndexOf(".") + 1);
                            }

                            String status = "SUCCESS";
                            if (eElement.getElementsByTagName("failure").getLength() > 0) {
                                status = "FAILURE";
                            } else if (eElement.getElementsByTagName("error").getLength() > 0) {
                                status = "ERROR";
                            } else if (eElement.getElementsByTagName("skipped").getLength() > 0) {
                                status = "SKIPPED";
                            }

                            testsList.add(createTestInfo(name, classname, status));
                        }
                    }
                } catch (Exception e) {
                    // Ignorar archivos XML corruptos
                }
            }

            int passed = totalTests - failed - skipped;
            results.put("status", failed > 0 ? "FAILED" : "PASSED");
            results.put("totalTests", totalTests);
            results.put("passed", passed);
            results.put("failed", failed);
            results.put("skipped", skipped);
            results.put("executionTimeMs", (int) (totalTime * 1000));
            results.put("timestamp", Instant.now().toString());
            results.put("tests", testsList);

        } catch (Exception e) {
            results.put("status", "ERROR");
            results.put("message", "Error al procesar los resultados de los tests: " + e.getMessage());
        }

        return results;
    }

    private Map<String, String> createTestInfo(String name, String className, String status) {
        Map<String, String> test = new HashMap<>();
        test.put("name", name);
        test.put("className", className);
        test.put("status", status);
        return test;
    }
}
