package com.depot_Bar.depot_bar.Services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.depot_Bar.depot_bar.Dto.AchatDto;
import com.depot_Bar.depot_bar.Models.AchatItem;
import com.depot_Bar.depot_bar.Models.Achats;
import com.depot_Bar.depot_bar.Models.Produits;
import com.depot_Bar.depot_bar.Repository.AchatRepository;
import com.depot_Bar.depot_bar.Repository.ProduitRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AchatService {

    private final AchatRepository achatRepository;

    private final ProduitService produitService;

    private final ProduitRepository produitRepository;


    public AchatDto enregistrerAchat(Achats achats) {

        achats.setDate(LocalDate.now());
        
        for (AchatItem item : achats.getItems()) {

            produitService.ajouterQuantite(item.getProduit().getName(), item.getQuantite());
            item.setAchat(achats);
        }
        Achats dbAchats =  this.achatRepository.save(achats);

        AchatDto res = entityToDto(dbAchats);

        return res;
    }


    public List<AchatDto> getAllAchats() {
        
        List<AchatDto> resList = new ArrayList<>();

        List<Achats> dbData = this.achatRepository.findAll();

        try {
            
            for(Achats achats: dbData) {

                AchatDto res = new AchatDto();
    
                res = entityToDto(achats);

                resList.add(res);
            }

        } catch (Exception e) {
            
            AchatDto res = new AchatDto();
            res.setMessage("Error while fetching data " + e);
            resList.add(res);

        }

        return resList;
    }


    public AchatDto entityToDto(Achats achats) {

        AchatDto res = new AchatDto();

        res.setId(achats.getId());
        res.setDate(achats.getDate());
        res.setMessage("Product!!!");

        List<String> nomEtCoutTotal = new ArrayList<>();
        double Tsum = 0.0;
        int totalItems = 0;
        
        for(AchatItem item: achats.getItems()) {

            Produits prod = produitRepository.findById(item.getProduit().getId())
            .orElseThrow(() -> new EntityNotFoundException("Produit not found with ID: " + item.getProduit().getId()));

            nomEtCoutTotal.add(
                "CodeProduit: " + prod.getId() +
                ", Nom produit: " + prod.getName() +
                ", Qte produit: " + item.getQuantite() +
                ", Prix unitaire: " + prod.getUnitPrice() +
                ", Total: " + (item.getQuantite() * prod.getUnitPrice())
            );

            Tsum += item.getQuantite() * prod.getUnitPrice();
            totalItems += item.getQuantite();
            
        }

        res.setCoutTotal(Tsum);
        res.setTotalItem(totalItems);
        res.setNomProdEtPrixT(nomEtCoutTotal);

        return res;
    }
    
}
