package com.depot_Bar.depot_bar.Services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.depot_Bar.depot_bar.Dto.VenteDto;
import com.depot_Bar.depot_bar.Models.Produits;
import com.depot_Bar.depot_bar.Models.Vente;
import com.depot_Bar.depot_bar.Models.VenteItem;
import com.depot_Bar.depot_bar.Repository.ProduitRepository;
import com.depot_Bar.depot_bar.Repository.VenteRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class VenteService {

    private final ProduitService produitService;

    private final ProduitRepository produitRepository;

    private final VenteRepository venteRepo;

    
    public VenteDto registerVente(Vente vente) {
        vente.setDate(LocalDate.now());

        VenteDto dto = new VenteDto();
        List<String> nomEtCoutTotal = new ArrayList<>();
        double coutTotal = 0.0;
        double prixVenduTotal = 0.0;
        double totalGain = 0.0;
        int totalItem = 0;

        for (VenteItem item : vente.getItems()) {
            Produits prod = produitRepository.findById(item.getProduit().getId())
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé"));

            double itemTotal;
            double itemGain;
            if (item.getPrixVendu() == 0) {
                // Use UnitPrice for both itemTotal and itemGain
                itemTotal = item.getQuantite() * prod.getUnitPrice();
                itemGain = 0;
            } else {
                itemTotal = item.getQuantite() * item.getPrixVendu();
                itemGain = (item.getPrixVendu() - prod.getUnitPrice()) * item.getQuantite();
            }

            nomEtCoutTotal.add("Code Prod: " + prod.getId() + 
            ", Nom Prod: " + prod.getName() + 
            ", Quantite Produit: " + item.getQuantite() +
            ", Prix unitaire: "+ prod.getUnitPrice() +
            ", Prix vendu(Pv): " + item.getPrixVendu() + 
            ", Total(Qte * Pv): " + itemTotal);

            coutTotal += itemTotal;
            prixVenduTotal += itemTotal;
            totalGain += itemGain;
            totalItem += item.getQuantite();

            produitService.retirerQuantite(prod.getId(), item.getQuantite());

            item.setPrix(itemTotal);
            item.setGain(itemGain);
            item.setVente(vente);
        }

        Vente saved = venteRepo.save(vente);

        dto.setId(saved.getId());
        dto.setDate(saved.getDate());
        dto.setCoutTotal(coutTotal);
        dto.setPrixVendu(prixVenduTotal);
        dto.setGain(totalGain);
        dto.setTotalItem(totalItem);
        dto.setNomProdEtPrixT(nomEtCoutTotal);
        dto.setMessage("Vente enregistrée avec succès");

        return dto;
    }

    public List<VenteDto> getAllVente(){

        List<Vente> allVente = this.venteRepo.findAll();

        List<VenteDto> resList = new ArrayList<>();

        try {
            
            if(allVente.size() <= 0){
                throw new EntityNotFoundException("No data found in DB!!");
            }

            for(Vente vente: allVente){

                VenteDto data = new VenteDto();
                List<String> nomEtCoutTotal = new ArrayList<>();
                double coutTotal = 0.0;  
                Integer totalItem = 0;
                double prixVenduTotal = 0.0;
                double totalGain = 0.0;

                for(VenteItem item: vente.getItems()){

                    Optional<Produits> dbProd = this.produitRepository.findById(item.getProduit().getId());

                    if(!dbProd.isPresent()){

                        throw new EntityNotFoundException("No Entity found");
                
                    }else{

                        double itemTotal;
                        double itemGain;

                        if (item.getPrixVendu() == 0) {
                            // Use UPrice for both itemTotal and itemGain
                            itemTotal = item.getQuantite() * dbProd.get().getUnitPrice();
                            itemGain = 0;
                        } else {
                            itemTotal = item.getQuantite() * item.getPrixVendu();
                            itemGain = (item.getPrixVendu() - dbProd.get().getUnitPrice()) * item.getQuantite();
                        }


                        nomEtCoutTotal.add(
                            "CodeProduit: " + dbProd.get().getId() + 
                            ", Nom produit: " + dbProd.get().getName() + 
                            ", Qte produit: " + item.getQuantite() +
                            ", Prix unitaire: " + dbProd.get().getUnitPrice() +
                            ", Prix vendu: " + item.getPrixVendu() +
                            ", Total: " + itemTotal
                     );

                        coutTotal += itemTotal;
                        prixVenduTotal += itemTotal;
                        totalGain += itemGain;
                        totalItem += item.getQuantite();
                    }

                }

                data.setId(vente.getId());
                data.setPrixVendu(prixVenduTotal);
                data.setDate(vente.getDate());
                data.setCoutTotal(coutTotal);
                data.setTotalItem(totalItem);
                data.setGain(totalGain);
                data.setNomProdEtPrixT(nomEtCoutTotal);
                data.setMessage("Data fetched with success");

                resList.add(data);
            }

        } catch (Exception e) {
            VenteDto data = new VenteDto();

            data.setMessage("Error while fetching data in DB " + e);
            resList.add(data);
        }

        return resList;
    }

    public VenteDto getVenteById(Long id) {
        Vente vente = venteRepo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Vente with ID " + id + " not found"));
    
        return mapVenteToDto(vente);
    }
    

    public List<VenteDto> getVentesByDate(LocalDate date) {
        List<Vente> ventes = venteRepo.findByDate(date); // You need to implement this in the repository

        if (ventes.isEmpty()) {
            throw new EntityNotFoundException("No ventes found for date " + date);
        }

        return ventes.stream()
                .map(this::mapVenteToDto)
                .collect(Collectors.toList());
    }

    private VenteDto mapVenteToDto(Vente vente) {

        VenteDto data = new VenteDto();
        List<String> nomEtCoutTotal = new ArrayList<>();
        double coutTotal = 0.0;  
        Integer totalItem = 0;
        double prixVenduTotal = 0.0;
        double totalGain = 0.0;

        for(VenteItem item: vente.getItems()){

            Optional<Produits> dbProd = this.produitRepository.findById(item.getProduit().getId());
            
            if(!dbProd.isPresent()){

                throw new EntityNotFoundException("No Entity found");
                
            }else{

                double itemTotal;
            double itemGain;
            if (item.getPrixVendu() == 0) {
                // Use UPrice for both itemTotal and itemGain
                itemTotal = item.getQuantite() * dbProd.get().getUnitPrice();
                itemGain = 0;
            } else {
                itemTotal = item.getQuantite() * item.getPrixVendu();
                itemGain = (item.getPrixVendu() - dbProd.get().getUnitPrice()) * item.getQuantite();
            }

                nomEtCoutTotal.add(
                    "CodeProduit: " + dbProd.get().getId() + 
                    ", Nom produit: " + dbProd.get().getName() + 
                    ", Qte produit: " + item.getQuantite() +
                    ", Prix unitaire: " + dbProd.get().getUnitPrice() +
                    ", designation: " + dbProd.get().getDesignation() +
                    ", description: " + dbProd.get().getDescription() +
                    ", Prix vendu: " + item.getPrixVendu() +
                    ", Total: " + itemTotal
                );

                coutTotal += itemTotal;
                prixVenduTotal += itemTotal;
                totalGain += itemGain;
                totalItem += item.getQuantite();
            }

        }

        data.setId(vente.getId());
        data.setPrixVendu(prixVenduTotal);
        data.setDate(vente.getDate());
        data.setCoutTotal(coutTotal);
        data.setTotalItem(totalItem);
        data.setGain(totalGain);
        data.setNomProdEtPrixT(nomEtCoutTotal);
        data.setMessage("Data fetched with success");

        return data;
    }



    
}
