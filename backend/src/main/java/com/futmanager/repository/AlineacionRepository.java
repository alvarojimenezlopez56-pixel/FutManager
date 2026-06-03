package com.futmanager.repository;

import com.futmanager.model.Alineacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlineacionRepository extends JpaRepository<Alineacion, Long> {
}
