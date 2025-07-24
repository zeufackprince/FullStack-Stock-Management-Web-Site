package com.depot_Bar.depot_bar.Models;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table
public class Produits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = true)
    private double unitPrice;

    @Column(name = "description", nullable = true)
    private String description;

    @Column(name = "min_quantity", nullable = true)
    private String designation;

    @ManyToOne
    private Vente vente;

    
}
