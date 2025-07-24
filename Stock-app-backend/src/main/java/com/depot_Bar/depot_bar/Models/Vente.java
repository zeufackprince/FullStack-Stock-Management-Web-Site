package com.depot_Bar.depot_bar.Models;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "dateVente", nullable = false)
    private LocalDate date;
    
    // @Column(name = "Quantite", nullable = false )
    // private Integer Qte;

    @OneToMany(mappedBy = "vente", cascade = CascadeType.ALL)
    private List<VenteItem> items;

    // @OneToMany
    // private List<Produits> listproduits;


}
