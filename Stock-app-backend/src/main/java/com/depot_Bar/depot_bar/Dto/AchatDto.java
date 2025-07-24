package com.depot_Bar.depot_bar.Dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AchatDto {

    private Long Id;

    private LocalDate date;

    // private Integer Qte;

    private double coutTotal;

    private Integer totalItem;

    private List<String> nomProdEtPrixT;

    private String message;
    
}
