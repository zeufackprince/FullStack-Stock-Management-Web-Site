package com.depot_Bar.depot_bar.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.depot_Bar.depot_bar.Dto.AchatDto;
import com.depot_Bar.depot_bar.Models.Achats;
import com.depot_Bar.depot_bar.Services.AchatService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/achat")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class AchatController {

    private final AchatService achatService;

    @PostMapping("/new-achat")
    public ResponseEntity<AchatDto> newAchat(@RequestBody Achats achats) {

        AchatDto res = this.achatService.enregistrerAchat(achats);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/get-all-achat")
    public ResponseEntity<List<AchatDto>> getAllAchat() {

        List<AchatDto> res = this.achatService.getAllAchats();

        return ResponseEntity.ok(res);
    }
    
}
