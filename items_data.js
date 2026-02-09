
// Baza cijena materijala (u EUR)
// Cijene su izražene bez PDV-a (ili s PDV-om ovisno o izvoru - ovdje su prepisane točno sa slike)

const prices = {
    // --- TERMOIZOLACIJA ---
    xps: {
        // Ravatherm XPS
        2: { price: 2.53, sku: "2001", name: "Ravatherm XPS, 2cm" },
        3: { price: 3.52, sku: "2002", name: "Ravatherm XPS: 3cm" },
        4: { price: 4.69, sku: "2003", name: "Ravatherm XPS: 4cm" },
        5: { price: 5.86, sku: "2004", name: "Ravatherm XPS: 5cm" },
        6: { price: 7.03, sku: "2005", name: "Ravatherm XPS: 6cm" },
        8: { price: 9.38, sku: "2006", name: "Ravatherm XPS: 8cm" },
        10: { price: 11.72, sku: "2007", name: "Ravatherm XPS: 10cm" },
        12: { price: 14.06, sku: "2008", name: "Ravatherm XPS: 12cm" },
        15: { price: 18.98, sku: "2009", name: "Ravatherm XPS: 15cm" }
    },

    wool_facade: {
        // Kamena vuna fasadna
        5: { price: 9.75, sku: "3006", name: "Kamena vuna, 5cm, fasadna" },
        8: { price: 11.38, sku: "3005", name: "Kamena vuna, 8cm, fasadna" },
        10: { price: 14.14, sku: "3001", name: "Kamena vuna, 10cm, fasadna" },
        12: { price: 16.97, sku: "3002", name: "Kamena vuna, 12cm, fasadna" },
        14: { price: 19.79, sku: "3003", name: "Kamena vuna, 14cm, fasadna" },
        15: { price: 21.29, sku: "3004", name: "Kamena vuna, 15cm, fasadna" }
    },

    // --- HIDROIZOLACIJA ---
    membranes: {
        tpo_15: { price: 9.02, sku: "2113", name: "FLAG TPO EP/PR 1,5 mm, krovna folija (bijela)" },
        tpo_18: { price: 11.21, sku: "2114", name: "FLAG TPO EP/PR 1,8 mm, krovna folija (bijela)" },
        tpo_20: { price: 12.68, sku: "2115", name: "FLAG TPO EP/PR 2,0 mm, krovna folija (bijela)" },
        pvc_temelji: { price: 6.34, sku: "2111", name: "FLAG BSL (PVC) 1,5 mm, folija za temelje" },
        pvc_krov: { price: 8.94, sku: "2112", name: "FLAG SR (PVC) 1,5 mm, krovna folija" },
        cepasta: { price: 1.54, sku: "2123", name: "ČEPASTA FOLIJA" },
        geotextile: { price: 0.81, sku: "2124", name: "Geotekstil, 200g" },
        geotextile_300: { price: 1.20, sku: "2125", name: "Geotekstil, 300g" } // Added based on user list if needed, or stick to 200g
    },

    bitumen: {
        diamond_p4: { price: 4.89, sku: "2117", name: "RAVAPROOF Diamond P 4, SBS, Polyester, s posipom, sivi" },
        ruby_v4: { price: 3.71, sku: "2118", name: "RAVAPROOF Ruby V-4" },
        sapphire_g3: { price: 1.95, sku: "2119", name: "RAVAPROOF Sapphire G3" },
        sapphire_g4: { price: 2.60, sku: "2120", name: "RAVAPROOF Sapphire G4" },
        vapor_al: { price: 4.89, sku: "2121", name: "RAVAPROOF Vapor Al-35 (3,5mm) , SBS" }
    },

    // --- FASADE (ETICS) ---
    facade_etics: {
        glue_eps: { price: 0.36, sku: "4101", name: "LJEPILO ZA EPS 25 KG" },
        glue_armor: { price: 0.39, sku: "4109", name: "UNITERM 25 KG" },
        mesh: { price: 1.13, sku: "4104", name: "STAKLENA MREŽICA PRIMAFAS 160" },
        grund: { price: 2.84, sku: "4105", name: "MINERALKVARC GRUND OBOJENI 65 15 L KANTI" },
        plaster_silicat: { price: 1.88, sku: "4108", name: "SILIKATNA ŽBUKA Z 1000 (1.5 MM) 25 KG" },
        dowel: { price: 0.36, sku: "4107", name: "PRIČVRSNICA PTV 200 MM" },
        profile_pvc: { price: 0.54, sku: "4103", name: "PROFIL PVC 2,50 M+MREŽICA 10X15" },
        profile_alu: { price: 3.74, sku: "4106", name: "PROFIL AL COKL 15 CM (0,8 MM) 2,50 M" },
        eps_base_cm: { price: 0.587, sku: "4102", name: "EPS F 1000X500X150 (TR150)" }
    },

    // --- PANEL OGRADE ---
    fence: {
        // 2D PANELI (RAL 7016)
        panel_2d: {
            83: { price: 25.68, sku: "1001", name: "Ogradni panel 2D 830x2500 6/5/6 RAL 7016" },
            103: { price: 28.93, sku: "1002", name: "Ogradni panel 2D 1030x2500 6/5/6 RAL 7016" },
            123: { price: 33.80, sku: "1003", name: "Ogradni panel 2D 1230x2500 6/5/6 RAL 7016" },
            143: { price: 38.68, sku: "1004", name: "Ogradni panel 2D 1430x2500 6/5/6 RAL 7016" },
            163: { price: 43.88, sku: "1005", name: "Ogradni panel 2D 1630x2500 6/5/6 RAL 7016" },
            183: { price: 48.75, sku: "1006", name: "Ogradni panel 2D 1830x2500 6/5/6 RAL 7016" },
            203: { price: 54.60, sku: "1007", name: "Ogradni panel 2D 2030x2500 6/5/6 RAL 7016" }
        },

        // 3D PANELI (5mm) - RAL 7016
        panel_3d_5: {
            83: { price: 20.48, sku: "1018", name: "Ogradni panel 3D 830x2500 5/5 RAL 7016" },
            103: { price: 24.05, sku: "1009", name: "Ogradni panel 3D 1030x2500 5/5 RAL 7016" },
            123: { price: 28.28, sku: "1011", name: "Ogradni panel 3D 1230x2500 5/5 RAL 7016" },
            153: { price: 35.75, sku: "1013", name: "Ogradni panel 3D 1530x2500 5/5 RAL 7016" },
            173: { price: 38.68, sku: "1015", name: "Ogradni panel 3D 1730x2500 5/5 RAL 7016" },
            203: { price: 46.15, sku: "1017", name: "Ogradni panel 3D 2030x2500 5/5 RAL 7016" }
        },

        // 3D PANELI (4mm) - RAL 7016
        panel_3d_4: {
            83: { price: 13.33, sku: "1019", name: "Ogradni panel 3D 830x2500 4/4 RAL 7016" },
            103: { price: 14.95, sku: "1008", name: "Ogradni panel 3D 1030x2500 4/4 RAL 7016" },
            123: { price: 17.23, sku: "1010", name: "Ogradni panel 3D 1230x2500 4/4 RAL 7016" },
            153: { price: 22.10, sku: "1012", name: "Ogradni panel 3D 1530x2500 4/4 RAL 7016" },
            173: { price: 24.70, sku: "1014", name: "Ogradni panel 3D 1730x2500 4/4 RAL 7016" },
            203: { price: 28.93, sku: "1016", name: "Ogradni panel 3D 2030x2500 4/4 RAL 7016" }
        },

        // Stupovi (sa pločicom)
        posts: {
            85: { price: 11.38, sku: "1020", name: "Stup sa pločicom 0,85 m" },
            105: { price: 12.68, sku: "1021", name: "Stup sa pločicom 1,05 m" },
            125: { price: 14.30, sku: "1022", name: "Stup sa pločicom 1,25 m" },
            145: { price: 16.90, sku: "1023", name: "Stup sa pločicom 1,45 m" },
            155: { price: 16.90, sku: "1024", name: "Stup sa pločicom 1,55 m" },
            165: { price: 19.83, sku: "1025", name: "Stup sa pločicom 1,65 m" },
            175: { price: 19.83, sku: "1026", name: "Stup sa pločicom 1,75 m" },
            185: { price: 22.75, sku: "1027", name: "Stup sa pločicom 1,85 m" },
            205: { price: 22.75, sku: "1028", name: "Stup sa pločicom 2,05 m" }
        },

        // Stupovi (za beton)
        posts_concrete: {
            150: { price: 13.00, sku: "1029", name: "Stup za beton 1,5 m" },
            175: { price: 14.63, sku: "1030", name: "Stup za beton 1,75 m" },
            200: { price: 16.25, sku: "1031", name: "Stup za beton 2,00 m" },
            230: { price: 18.20, sku: "1032", name: "Stup za beton 2,30 m" },
            250: { price: 21.45, sku: "1033", name: "Stup za beton 2,50 m" }
        },

        set_spojnica: { price: 0.42, sku: "1039", name: "PVC Spojnica (s vijkom)" }, // Updated Name
        anker_vijci: { price: 0.59, sku: "1040", name: "SIDRENI VIJAK ZN M10" },
        zastita_ok: { price: 0, sku: "1041", name: "ZAŠTITA OD POGLEDA, REBRASTA, 26 m²" }, // Placeholder price
        pricvrsnica_traka: { price: 0, sku: "1042", name: "PVC PRIČVRSNICA ZA TRAKU" }, // Placeholder price
        montaza_plate: { price: 31.25, sku: "1043", name: "montaža na parapet/m'" },
        montaza_concrete: { price: 43.75, sku: "1044", name: "montaža u beton/m'" },

        gate_prices: {
            // Updated to match specific gate SKUs
            '1000x1000': { plate: { p: 266.50, s: '1034' }, concrete: { p: 266.50, s: '1034' } },
            '1000x1200': { plate: { p: 315.25, s: '1035' }, concrete: { p: 315.25, s: '1035' } },
            '1000x1500': { plate: { p: 390.00, s: '1036' }, concrete: { p: 390.00, s: '1036' } },
            '1000x1700': { plate: { p: 448.50, s: '1037' }, concrete: { p: 448.50, s: '1037' } },
            '1000x2000': { plate: { p: 513.50, s: '1038' }, concrete: { p: 513.50, s: '1038' } }
        }
    },

    chemicals: {
        aquamat_elastic: { price: 1.95, sku: "2128", name: "Isomat Aquamat Elastic sivi, 35kg (A+B komp)" },
        isoflex_pu500: { price: 7.96, sku: "2130", name: "Isomat: Isoflex PU500, bijeli, (poliuretan)" },
        ak20: { price: 0.45, sku: "2122", name: "Isomat AK 20" },
        fimizol: { price: 2.25, sku: "2131", name: "FIMIZOL, 9L, bitumenski premaz" },
        insta_stik: { price: 10.29, sku: "2010", name: "Dow Insta Stik, za pištolj" },
        pu_primer: { price: 0, sku: "2129", name: "Isomat PU pimer, 5kg" } // Added
    },

    others: {
        tpo_lim: { price: 42.25, sku: "2126", name: "TPO LIM (2 X 1m)" },
        pvc_lim: { price: 39.00, sku: "2127", name: "PVC LIM (2 X 1m)" },
        bentoshield: { price: 6.91, sku: "2116", name: "Bentoshiled MAX5 (bentonit, bentonitna traka)" },
        ob_12: { price: 5.94, sku: "3010", name: "OSB ploče 12mm (2500 x 675mm)" },
        osb_15: { price: 7.43, sku: "3007", name: "OSB ploče 15mm (2500 x 675mm)" },
        osb_18: { price: 8.91, sku: "3008", name: "OSB ploče 18mm (2500 x 675mm)" },
        osb_22: { price: 10.89, sku: "3009", name: "OSB ploče 22mm (2500 x 675mm)" },
        ethafoam: { price: 1.94, sku: "OTH-02", name: "Ethafoam podloga" }, // Keep existing if not in user list but used in logic? User didn't delete, just didn't list.
        cellucushion: { price: 1.40, sku: "OTH-03", name: "Cellucushion" },
        reflectix: { price: 3.46, sku: "OTH-04", name: "Reflectix folija" }
    }
};

// Helpers (Updated to handle objects)
// Helpers (Updated to handle objects)
function getXPSPrice(thickness) {
    if (prices.xps[thickness]) return prices.xps[thickness].price;
    return 0;
}

function getXPSCost(thickness) {
    if (costs.xps[thickness]) return costs.xps[thickness];
    return 0;
}

function getWoolPrice(thickness) {
    if (prices.wool_facade[thickness]) return prices.wool_facade[thickness].price;
    return 0;
}

function getWoolCost(thickness) {
    if (costs.wool_facade[thickness]) return costs.wool_facade[thickness];
    return 0;
}
// --- NABAVNE CIJENE (COSTS) ---
// Potrebno za izračun marže
const costs = {
    // Nabavna cijena (SA PDV)
    facade_etics: {
        glue_eps: 0.30,         // 4101
        glue_wool: 0.30,        // 4101 (Assumption: same as EPS glue if not specified separately, or 0 if unknown) -> User didn't specify "Ljepilo za vunu" SKU. I'll leave 0 or use EPS glue as placeholder? User prompted "kako ne znaš cijene". I'll check if there is a wool glue. 
        // User list has: 4101 LJEPILO ZA EPS. 4109 UNITERM. 
        // logic in calc says: if wool, use glue_wool. items_data.js doesn't have glue_wool in prices? 
        // In prices: glue_eps (4101), glue_armor (4109). 
        // Calc logic: if wool, price = prices.facade_etics.glue_wool || prices.facade_etics.glue_eps.
        // I will set glue_wool to 0.30 (same as EPS) safely for now.
        glue_wool: 0.30,
        glue_armor: 0.325,      // 4109
        mesh: 0.9375,           // 4104
        grund: 2.3625,          // 4105
        plaster_silicat: 1.5625,// 4108
        dowel: 0.30,            // 4107
        profile_pvc: 0.45,      // 4103
        profile_alu: 3.1125,    // 4106
        eps_base_cm: 0.489167   // 4102 (7.3375 / 15)
    },
    xps: {
        // Ravatherm XPS (Using ratio from 2cm SKU 2001: 2.025. Price is 2.53. Ratio ~0.8)
        // 2001 (2cm): 2.025
        // 2002 (3cm): 2.8125
        // 2003 (4cm): 3.75
        // 2004 (5cm): 4.6875
        // 2005 (6cm): 5.625
        // 2006 (8cm): 7.5
        // 2007 (10cm): 9.375
        // 2008 (12cm): 11.25
        // 2009 (15cm): 15.1875
        2: 2.025,
        3: 2.8125,
        4: 3.75,
        5: 4.6875,
        6: 5.625,
        8: 7.5,
        10: 9.375,
        12: 11.25,
        15: 15.1875
    },
    wool_facade: {
        // Kamena vuna
        // 3006 (5cm): 7.5
        // 3005 (8cm): 8.75
        // 3001 (10cm): 10.875
        // 3002 (12cm): 13.05
        // 3003 (14cm): 15.225
        // 3004 (15cm): 16.375
        5: 7.5,
        8: 8.75,
        10: 10.875,
        12: 13.05,
        14: 15.225,
        15: 16.375
    },
    membranes: {
        // TPO/PVC map
        tpo_15: 6.9375, // 2113
        tpo_18: 8.625,  // 2114
        tpo_20: 9.75,   // 2115
        pvc_temelji: 4.875, // 2111
        pvc_krov: 6.875,    // 2112
        cepasta: 1.1875,    // 2123
        geotextile: 0.625   // 2124 (200g)
    },
    bitumen: {
        diamond_p4: 3.6875, // 2117
        ruby_v4: 2.75,      // 2118
        sapphire_g3: 1.5,   // 2119
        sapphire_g4: 2.0,   // 2120
        vapor_al: 3.5       // 2121
    },
    fence: {
        panel_2d: {
            83: 19.75,
            103: 22.25,
            123: 26.00,
            143: 29.75, // Note: 29.75384615 -> 29.75
            163: 33.75, // Note: 33.75384615 -> 33.75
            183: 37.50,
            203: 42.00
        },
        panel_3d_5: {
            83: 15.75, // 1018
            103: 18.50, // 1009
            123: 21.75, // 1011
            153: 27.50, // 1013
            173: 29.75, // 1015
            203: 35.50  // 1017
        },
        panel_3d_4: {
            83: 10.25, // 1019
            103: 11.50, // 1008
            123: 13.25, // 1010
            153: 17.00, // 1012
            173: 19.00, // 1014
            203: 22.25  // 1016
        },
        posts: {
            // Sa pločicom
            85: 8.75,
            105: 9.75,
            125: 11.00,
            145: 13.00,
            155: 13.00,
            165: 15.25,
            175: 15.25,
            185: 17.50,
            205: 17.50
        },
        posts_concrete: {
            // Za beton
            150: 10.00,
            175: 11.25,
            200: 12.50,
            230: 14.00,
            250: 16.50
        },
        gates: {
            '1000x1000': 205.00,
            '1000x1200': 242.50,
            '1000x1500': 300.00,
            '1000x1700': 345.00,
            '1000x2000': 395.00
        },
        set_spojnica: 0.325, // 1039
        anker_vijci: 0.45,   // 1040
        montaza_plate: 31.25, // 1043
        montaza_concrete: 43.75 // 1044
    },
    chemicals: {
        aquamat_elastic: 1.5, // 2128
        isoflex_pu500: 5.875, // 2130
        ak20: 0.375,         // 2122
        fimizol: 16.875,     // 2131
        insta_stik: 7.625    // 2010
    },
    others: {
        tpo_lim: 32.5,       // 2126
        pvc_lim: 30.0,       // 2127
        bentoshield: 5.3125, // 2116
        ob_12: 4.95,         // 3010
        osb_15: 6.1875,      // 3007
        osb_18: 7.425,       // 3008
        osb_22: 9.075,       // 3009
        ethafoam: 0,         // NO SKU provided in list? list ends at 4109? Ah, wait OTH-02 not in user list. 
        cellucushion: 0,
        reflectix: 0
    }
};
