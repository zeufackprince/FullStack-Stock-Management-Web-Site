package com.depot_Bar.depot_bar.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.depot_Bar.depot_bar.Dto.VenteDto;
import com.depot_Bar.depot_bar.Models.Vente;
import com.depot_Bar.depot_bar.Services.VenteService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/vente")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class VenteController {

    private final VenteService venteService;

    //Create a new vente
    @PostMapping("/newVente")
    public ResponseEntity<VenteDto> createVente(@RequestBody Vente vente) {
        VenteDto venteDto = venteService.registerVente(vente);
        return ResponseEntity.ok(venteDto);
    }

    // GET all vente
    @GetMapping("/getAllVente")
    public ResponseEntity<List<VenteDto>> getAllVente(){

        List<VenteDto> ventes = venteService.getAllVente();
        return ResponseEntity.ok(ventes);
    }
    

    // GET vente by ID
    @GetMapping("/by-id/{id}")
    public ResponseEntity<VenteDto> getVenteById(@PathVariable Long id) {
        VenteDto vente = venteService.getVenteById(id);
        return ResponseEntity.ok(vente);
    }

    // GET ventes by Date (format: yyyy-MM-dd)
    @GetMapping("/by-date/{date}")
    public ResponseEntity<List<VenteDto>> getVentesByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<VenteDto> ventes = venteService.getVentesByDate(date);
        return ResponseEntity.ok(ventes);
    }
}
