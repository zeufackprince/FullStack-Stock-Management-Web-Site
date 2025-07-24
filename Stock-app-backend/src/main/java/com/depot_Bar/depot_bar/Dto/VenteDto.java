package com.depot_Bar.depot_bar.Dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VenteDto {

    private Long id;

    private LocalDate date;

    private double coutTotal;

    private double prixVendu;

    private double gain;

    private Integer totalItem;

    private double prixUnitaire;
 
    private List<String> nomProdEtPrixT;

    private String message;

}
