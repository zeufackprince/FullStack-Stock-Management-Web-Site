package com.depot_Bar.depot_bar.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.depot_Bar.depot_bar.Models.Vente;

public interface VenteRepository extends JpaRepository<Vente, Long> {

    List<Vente> findByDate(LocalDate date);

    
    
}
