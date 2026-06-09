# Bilder (public/)

Legg dine nedlastede bilder her. Appen finner dem automatisk – ingen kodeendring
nødvendig. Mangler en fil, faller appen pent tilbake (hero → gradient, hus →
placeholder/WordPress-bilde).

## Hero-bilde (bakgrunn øverst på siden)

Legg ett bilde her:

```
public/hero.jpg
```

(Det fine hvite Sørlandshuset passer perfekt. JPG, gjerne ~1920px bredt.)

## Hus-bilder (kort på resultatskjermen)

Legg ett bilde per hustype i `public/houses/`, navngitt etter hustypens "slug"
(siste del av url-en). Filnavnene som forventes:

```
public/houses/mandal.jpg
public/houses/okso.jpg
public/houses/kristiansand.jpg
public/houses/hanko.jpg
public/houses/sogne.jpg
public/houses/homborsund.jpg
public/houses/lillesand.jpg
public/houses/matros.jpg
public/houses/kragero.jpg
public/houses/holmsbu.jpg
public/houses/hellesund.jpg
public/houses/hovag.jpg
public/houses/tvedestrand.jpg
public/houses/kilsund.jpg
public/houses/brekkesto.jpg
public/houses/arnestad.jpg
public/houses/hudoy.jpg
public/houses/tonsberg.jpg
public/houses/sandefjord.jpg
public/houses/bygdoy-2.jpg
public/houses/herregard.jpg
```

> Tips: du trenger ikke alle med en gang. Resultatskjermen viser kun topp-3, så
> det holder å starte med noen få for en fin demo.

Etter at filene er lagt inn: `npm run dev` (eller redeploy på Netlify).
