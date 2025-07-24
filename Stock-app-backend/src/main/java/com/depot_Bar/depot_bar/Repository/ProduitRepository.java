package com.depot_Bar.depot_bar.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.depot_Bar.depot_bar.Models.Produits;


public interface ProduitRepository extends JpaRepository<Produits, Long>{

    Produits  findByNom(String nom);
}
