# Patient Management Application

Application de gestion des patients pour cabinet médical développée avec Angular et JSON Server.

## Description

Application web complète pour faciliter la gestion des patients dans un cabinet médical. Permet aux utilisateurs (secrétaires, médecins) de consulter, ajouter, modifier et suivre les patients, ainsi que leurs rendez-vous et traitements.

## Fonctionnalités

- ✅ Liste des patients avec recherche et filtres
- ✅ Ajout de nouveaux patients avec validation
- ✅ Modification des informations patients
- ✅ Détails complets des patients
- ✅ Gestion des rendez-vous
- ✅ Suivi des traitements
- ✅ Interface utilisateur moderne et responsive

## Technologies Utilisées

- **Frontend**: Angular 19.2, Bootstrap 5, SCSS
- **Backend**: JSON Server (simulation API)
- **Autres**: RxJS, TypeScript, Bootstrap Icons

## Installation

1. Cloner le projet et naviguer dans le dossier:
```bash
cd /home/ahmed/Desktop/projetAngular
```

2. Installer les dépendances:
```bash
npm install --legacy-peer-deps
```

## Démarrage

### Option 1: Démarrage manuel (2 terminaux)

**Terminal 1 - JSON Server:**
```bash
npm run json-server
```
Le serveur démarre sur http://localhost:3000

**Terminal 2 - Application Angular:**
```bash
npm start
```
L'application démarre sur http://localhost:4200

### Option 2: Démarrage automatique (1 terminal)

```bash
npm run dev
```
Lance les deux serveurs simultanément

## Accès à l'Application

Ouvrir le navigateur et aller sur: **http://localhost:4200**

## Structure du Projet

```
src/
├── app/
│   ├── components/        # Composants Angular
│   │   ├── patient-list/
│   │   ├── add-patient/
│   │   ├── edit-patient/
│   │   ├── patient-details/
│   │   ├── appointment-list/
│   │   └── search-filter/
│   ├── models/           # Interfaces TypeScript
│   ├── services/         # Services HTTP
│   └── app.routes.ts     # Configuration des routes
├── styles.scss           # Styles globaux
└── db.json              # Base de données JSON Server
```

## API Endpoints

### Patients
- `GET /patients` - Liste tous les patients
- `GET /patients/:id` - Détails d'un patient
- `POST /patients` - Créer un patient
- `PUT /patients/:id` - Modifier un patient

### Rendez-vous
- `GET /appointments` - Liste tous les rendez-vous
- `GET /appointments?patientId=:id` - Rendez-vous d'un patient
- `PATCH /appointments/:id` - Mettre à jour le statut

### Traitements
- `GET /treatments` - Liste tous les traitements
- `GET /treatments?patientId=:id` - Traitements d'un patient

## Fonctionnalités Détaillées

### Page d'Accueil
- Affichage de tous les patients en cartes
- Recherche par nom ou prénom
- Filtrage par sexe et date de rendez-vous
- Bouton pour ajouter un nouveau patient

### Détails Patient
- Informations personnelles complètes
- Timeline des rendez-vous (passés et futurs)
- Liste des traitements prescrits
- Bouton de modification

### Gestion des Rendez-vous
- Vue d'ensemble de tous les rendez-vous
- Statuts: Programmé, Effectué, Annulé
- Actions pour marquer comme effectué ou annuler

## Validation des Formulaires

- Champs obligatoires: Prénom, Nom, Date de naissance, Sexe, Téléphone
- Validation du format de téléphone
- Messages d'erreur en temps réel
- Feedback visuel sur les champs invalides

## Design

- Interface moderne avec dégradés de couleurs
- Animations fluides et transitions
- Design responsive (mobile, tablette, desktop)
- Thème violet/bleu avec effets glassmorphism
- Police personnalisée: Inter (Google Fonts)

## Données de Test

L'application inclut 5 patients d'exemple avec:
- Informations personnelles complètes
- Historique médical
- Rendez-vous passés et futurs
- Traitements prescrits

## Auteur

**Projet Angular - Gestion des Patients**  
Classe: 3GT TST  
Enseignante: Mme INES Jemal  
Année universitaire: 2025/2026

## Licence

Projet éducatif
