
// Baza cijena materijala (u EUR)
// Cijene su izražene bez PDV-a (ili s PDV-om ovisno o izvoru - ovdje su prepisane točno sa slike)

const prices = {
    // --- TERMOIZOLACIJA ---
    xps: {
        // Cijene po m2 ovisno o debljini (cm)
        2: 2.87,
        3: 3.95,
        4: 5.27,
        5: 6.58,
        6: 7.90,
        8: 10.53,
        10: 13.16,
        12: 15.80,
        15: 21.01
    },

    wool_facade: {
        // Kamena vuna fasadna po cm
        8: 12.15,
        10: 15.19,
        12: 18.23,
        14: 21.26,
        15: 22.78
    },

    // --- HIDROIZOLACIJA ---
    membranes: {
        tpo_15: 9.33,  // FLAG TPO 1.5mm
        tpo_18: 11.22, // FLAG TPO 1.8mm
        tpo_20: 12.15, // FLAG TPO 2.0mm
        pvc_temelji: 6.24, // FLAG BSL 1.5mm
        pvc_krov: 9.11,    // FLAG SR 1.5mm
        cepasta: 1.60,      // Čepasta folija
        geotextile: 1.20   // Geotekstil (Placeholder)
    },

    bitumen: {
        diamond_p4: 4.88, // RAVAPROOF Diamond P 4
        ruby_v4: 3.71,    // RAVAPROOF Ruby V-4
        sapphire_g3: 1.91,
        sapphire_g4: 2.65,
        vapor_al: 4.89    // Vapor Al-35
    },

    // --- PANEL OGRADE ---
    fence: {
        // --- 2D PANELI (6/5/6 mm) ---
        panel_2d_83: 26.50, // Extrapolated
        panel_2d_103: 32.50,
        panel_2d_123: 38.80,
        panel_2d_143: 44.50, // 2D often uses 143 instead of 153, fitting to standard logic
        panel_2d_163: 51.00,
        panel_2d_183: 58.00,
        panel_2d_203: 65.00,

        // --- 3D PANELI (5 mm) ---
        panel_3d_5_83: 19.50, // Extrapolated
        panel_3d_5_103: 24.50,
        panel_3d_5_123: 29.00,
        panel_3d_5_153: 35.50,
        panel_3d_5_173: 41.00,
        panel_3d_5_203: 48.00,

        // --- 3D PANELI (4 mm) ---
        panel_3d_4_83: 15.50, // Extrapolated
        panel_3d_4_103: 18.50,
        panel_3d_4_123: 21.80,
        panel_3d_4_153: 26.50,
        panel_3d_4_173: 31.20,
        panel_3d_4_203: 36.40,

        // Stupovi (s pločicom ili za betoniranje - usrednjeno)
        post_85: 9.00,
        post_105: 11.00,
        post_125: 13.50,
        post_135: 14.50, // Potential concrete for 85
        post_145: 15.00,
        post_155: 16.00,
        post_165: 17.50,
        post_175: 19.50,
        post_185: 21.00,
        post_195: 22.00,
        post_205: 23.00,
        post_215: 24.50,
        post_225: 26.00,
        post_235: 27.50,
        post_245: 29.00,
        post_255: 31.00,
        post_265: 33.00,

        // Pribor
        set_spojnica: 1.50, // Vijak + Spojnica
        anker_vijci: 0.80,   // Po komadu
        montaza_plate: 25.00, // Cijena po metru (s pločicom)
        montaza_concrete: 40.00, // Cijena po metru (betoniranje)

        // Pješačka vrata (Dimenzija -> [Pločica, Beton])
        gate_prices: {
            '1000x1000': { plate: 250, concrete: 300 },
            '1000x1200': { plate: 270, concrete: 350 },
            '1000x1500': { plate: 310, concrete: 420 },
            '1000x1700': { plate: 360, concrete: 450 },
            '1000x2000': { plate: 400, concrete: 520 }
        }
    },

    chemicals: {
        aquamat_elastic: 1.86, // A+B (kg)
        isoflex_pu500: 8.27,   // kg
        ak20: 0.52             // Isomat AK 20 (kg)
    },

    others: {
        tpo_lim: 42.10, // kom (2x1m)
        pvc_lim: 37.97, // kom (2x1m)
        bentoshield: 7.17, // Bentoshield MAX5 (m2?)
        ob_12: 6.28,   // OBB ploča 12mm
        osb_15: 7.85,
        osb_18: 9.42,
        osb_22: 11.51,
        ethafoam: 1.94, // 5mm
        cellucushion: 1.40, // 5mm
        reflectix: 3.46
    }
};

// Pomoćna funkcija za dohvat cijene XPS-a
function getXPSPrice(thickness) {
    // Ako nema točne debljine, vraća 0 (ili se može dodati logika za najbližu)
    return prices.xps[thickness] || 0;
}

// Pomoćna funkcija za dohvat cijene vune
function getWoolPrice(thickness) {
    return prices.wool_facade[thickness] || 0;
}
