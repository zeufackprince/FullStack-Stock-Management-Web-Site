package com.depot_Bar.depot_bar.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProduitDto {

    private Long id;

    private String name;

    private int quantity;

    private String message;

    private Integer code;

    private double unitPrice;

    private Long venteId;


    private String description;

    private String designation;
    
    private int minQuantity;
}
