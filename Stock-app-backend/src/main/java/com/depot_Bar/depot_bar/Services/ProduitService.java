package com.depot_Bar.depot_bar.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.depot_Bar.depot_bar.Dto.ProduitDto;
import com.depot_Bar.depot_bar.Models.Produits;
import com.depot_Bar.depot_bar.Models.Vente;
import com.depot_Bar.depot_bar.Repository.ProduitRepository;
import com.depot_Bar.depot_bar.Repository.VenteRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ProduitService {

    private final VenteRepository venteRepository;

    private final ProduitRepository proReop;

    public ProduitDto newproduit(String nom, int qte, double uprix) {

        ProduitDto res = new ProduitDto();

        Produits prod = new Produits();

        try {
            Produits produit = this.proReop.findByNom(nom);

            if(produit == null){

                prod.setName(nom);
            }

            prod.setQuantity(qte);
            prod.setUnitPrice(uprix);

            Produits db = this.proReop.save(prod);

            res = dtoToEntity(db);
            res.setMessage("product created succesfully!!!!!");
            res.setCode(200);

        } catch (Exception e) {

            res.setMessage("the Entry is invalide" + e);
            res.setCode(500);

        }
        
        return res;
        
    }

    public List<ProduitDto> getAllProduit(){
        

        List<ProduitDto> resList = new ArrayList<>();
        ProduitDto dto = new ProduitDto();

        try{

            List<Produits> list = this.proReop.findAll();


            for(Produits prod: list){
                dto = dtoToEntity(prod);
                dto.setCode(200);
                dto.setMessage("list of products");
                resList.add(dto);
            }

            if(resList.size() <= 0 || resList == null ){

                dto.setMessage("No Product Found!!");
                resList.add(dto);
            }


        }catch(Exception e){
            dto.setCode(500);
            dto.setMessage("Errot fetching the List of Products " + e);
            resList.add(dto);

        }
        
        return resList;


    }


    public ProduitDto updateProd(Long id ,ProduitDto prod){

        

        ProduitDto res = new ProduitDto();

        try{

            Optional<Produits> dbProd = this.proReop.findById(id);

            if(!dbProd.isPresent()){

                res.setCode(500);
                res.setMessage("no Product at id " + id);


            }else{



                dbProd.get().setQuantity(prod.getQuantity());
                dbProd.get().setUnitPrice(prod.getUnitPrice());
                dbProd.get().setName(prod.getName());

                Produits db = this.proReop.save(dbProd.get());

                res = dtoToEntity(db);

                res.setCode(200);
                res.setMessage("Update sucessfull");
            }
        }catch(Exception e){

            res.setCode(500);
            res.setMessage("Errot fetching the List of Products " + e);

        }

        return res;

    }

    public ProduitDto getProduitById(Long id){

        ProduitDto res = new ProduitDto();

        try {
            
            Optional<Produits> dbProd = this.proReop.findById(id);
            
            res = dtoToEntity(dbProd.get());
            res.setCode(200);
            res.setMessage("Sucessful!!");

        } catch (Exception e) {
            
            res.setCode(500);
            res.setMessage("Errot fetching the List of Products " + e);
        }

        return res;
    }


    public ProduitDto getprodByNom(String nom) {
        
        ProduitDto res = new ProduitDto();

        try {
            
            Produits dbProd = this.proReop.findByNom(nom);
            
            res = dtoToEntity(dbProd);
            res.setCode(200);
            res.setMessage("Sucessful!!");

        } catch (Exception e) {
            
            res.setCode(500);
            res.setMessage("Errot fetching the List of Products " + e);
        }

        return res;
    }

    public ProduitDto deleteProd(Long id) {
       
        ProduitDto res = new ProduitDto();

        try {
            
            Optional<Produits> prod = this.proReop.findById(id);
            if(prod.isPresent()){

                this.proReop.deleteById(id);
            }
            res.setCode(200);
            res.setMessage("delete ok!!");
        } catch (Exception e) {
            res.setCode(500);
            res.setMessage("Error when deleting Product! " + e);
        }

        return res;
    }

    public ProduitDto dtoToEntity(Produits prod){

        ProduitDto res = new ProduitDto();

        if(prod == null){

            return null;
        }

        res.setId(prod.getId());
        res.setName(prod.getName());
        res.setQuantity(prod.getQuantity());
        res.setUnitPrice(prod.getUnitPrice());

        // res.setVenteId(prod.getVente().getId());

        return res;
    
    }


    public Produits EntityToDto(ProduitDto prod){

        Produits res = new Produits();

        Vente vente = venteRepository.findById(prod.getId()).get();

            res.setId(prod.getId());
            res.setName(prod.getName());
            res.setQuantity(prod.getQuantity());
            res.setUnitPrice(prod.getUnitPrice());
            res.setVente(vente);

        return res;
    }
  
    public List<Produits> saveAll(List<Produits> produits) {
        return proReop.saveAll(produits);
    }
    

    public void ajouterQuantite(Long produitId, int quantite) {
        Produits p = proReop.findById(produitId).orElseThrow();
        p.setQuantity(p.getQuantity() + quantite);
        proReop.save(p);
    }

    public void retirerQuantite(Long produitId, int quantite) {
        Produits p = proReop.findById(produitId).orElseThrow();
        if (p.getQuantity() < quantite) throw new RuntimeException("Stock insuffisant");
        p.setQuantity(p.getQuantity() - quantite);
        proReop.save(p);
    }
}


