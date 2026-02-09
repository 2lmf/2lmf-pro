
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
        geotextile: { price: 0.81, sku: "2124", name: "Geotekstil, 200g" }
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

        set_spojnica: { price: 0.42, sku: "1039", name: "PVC Spojnica" },
        anker_vijci: { price: 0.59, sku: "1040", name: "SIDRENI VIJAK ZN M10" },
        montaza_plate: { price: 31.25, sku: "1043", name: "montaža na parapet/m'" },
        montaza_concrete: { price: 43.75, sku: "1044", name: "montaža u beton/m'" },

        gate_prices: {
            // Placeholder Logic: Using Single SKU for both mount types as per User List
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
        insta_stik: { price: 10.29, sku: "2010", name: "Dow Insta Stik, za pištolj" }
    },

    others: {
        tpo_lim: { price: 42.25, sku: "2126", name: "TPO LIM (2 X 1m)" },
        pvc_lim: { price: 39.00, sku: "2127", name: "PVC LIM (2 X 1m)" },
        bentoshield: { price: 6.91, sku: "2116", name: "Bentoshiled MAX5 (bentonit, bentonitna traka)" },
        ob_12: { price: 5.94, sku: "3010", name: "OSB ploče 12mm (2500 x 675mm)" },
        osb_15: { price: 7.43, sku: "3007", name: "OSB ploče 15mm (2500 x 675mm)" },
        osb_18: { price: 8.91, sku: "3008", name: "OSB ploče 18mm (2500 x 675mm)" },
        osb_22: { price: 10.89, sku: "3009", name: "OSB ploče 22mm (2500 x 675mm)" },
        ethafoam: { price: 1.94, sku: "OTH-02", name: "Ethafoam podloga" },
        cellucushion: { price: 1.40, sku: "OTH-03", name: "Cellucushion" },
        reflectix: { price: 3.46, sku: "OTH-04", name: "Reflectix folija" }
    }
};

// Helpers (Updated to handle objects)
function getXPSPrice(thickness) {
    if (prices.xps[thickness]) return prices.xps[thickness].price;
    return 0;
}

function getWoolPrice(thickness) {
    if (prices.wool_facade[thickness]) return prices.wool_facade[thickness].price;
    return 0;
}
