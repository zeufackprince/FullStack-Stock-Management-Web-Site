package com.depot_Bar.depot_bar.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.depot_Bar.depot_bar.Dto.ProduitDto;
import com.depot_Bar.depot_bar.Models.Produits;
import com.depot_Bar.depot_bar.Repository.ProduitRepository;
import com.depot_Bar.depot_bar.Services.ProduitService;

import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class ProduitController {

    private final ProduitService produitService;

    private final ProduitRepository produitRepository;

    @PostMapping("/produit/create")
    public ProduitDto newproduit(@RequestBody ProduitDto produits) {

        ProduitDto res = new ProduitDto();
        if (produits.getName() == null || produits.getQuantity() <= 0 || produits.getUnitPrice() <= 0) {

            res.setMessage("Error invalide entry");
            res.setCode(400);

        } else {
            res = this.produitService.newproduit(produits);
        }

        return res;
    }

    @PostMapping("/produits/batch")
    public ResponseEntity<?> saveManyProduits(@RequestBody List<Produits> produits) {
        List<Produits> savedProduits = produitRepository.saveAll(produits);
        return ResponseEntity.ok(savedProduits);
    }

    @PutMapping("/produit/update/{id}")
    public ProduitDto updateProd(@PathVariable Long id, @RequestBody ProduitDto prod) {

        return this.produitService.updateProd(id, prod);
    }

    @DeleteMapping("/produit/delete/{Id}")
    public ProduitDto deleteProd(@PathVariable Long Id) {

        return this.produitService.deleteProd(Id);
    }

    @GetMapping("/produit/{id}")
    public ProduitDto getProdById(@PathVariable Long id) {

        return this.produitService.getProduitById(id);
    }

    @GetMapping("/produit/getAllProd")
    public List<ProduitDto> getAllProduit() {

        return this.produitService.getAllProduit();
    }

    @GetMapping("/produit/getProdByNom/{nom}")
    public ProduitDto getProdByNom(@PathVariable String nom) {

        return this.produitService.getprodByNom(nom);
    }

}
