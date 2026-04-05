# Rapport Agile Scrum
## Projet Marketplace Web

**Periode du projet :** Janvier 2025 - Juin 2025  
**Duree :** 6 mois  
**Niveau cible :** Rapport academique etudiant ingenieur  
**Contexte technique :** Frontend Vue 3 + Backend NestJS + MySQL + Docker/DevOps

---

## 1. Introduction generale

Ce rapport presente la conduite du projet Marketplace selon la methode Agile Scrum sur une periode de six mois, de janvier a juin 2025. L'objectif est de decrire une planification realiste de type entreprise, organisee en releases puis en sprints, avec une logique de livraison de valeur progressive.

Le projet met en oeuvre une plateforme marketplace multi-acteurs :
- **Client** : consultation catalogue, panier, commande, wishlist, suivi de vendeurs.
- **Vendeur** : gestion de produits, categories vendeur, suivi interactions clients.
- **Administrateur** : gestion globale utilisateurs, vendeurs, categories, commentaires, supervision.

L'architecture technique est distribuee en deux applications principales :
- **Frontend** : Vue 3, Vue Router, Axios, Bootstrap, i18n.
- **Backend** : NestJS modulaire, TypeORM, MySQL, JWT, modules metier (auth, product, cart, order, review, seller-follow, chat, dashboard, upload, mail).

---

## 2. Methodologie Scrum adoptee

### 2.1 Organisation Agile

Le projet a ete structure en :
- **3 Releases** (2 mois chacune),
- **6 Sprints** (2 sprints par release),
- **duree moyenne sprint** : 4 semaines.

### 2.2 Roles Scrum

- **Product Owner (PO)** : priorisation des besoins metier et validation fonctionnelle.
- **Scrum Master (SM)** : facilitation ceremoniale, suivi des impediments, respect du cadre Scrum.
- **Equipe de developpement** : conception, implementation, tests, integration et demonstration.

### 2.3 Ceremonies Scrum

- Sprint Planning (debut sprint)
- Daily Scrum (suivi quotidien)
- Sprint Review (validation increment)
- Sprint Retrospective (amelioration continue)

### 2.4 Artefacts Scrum

- Product Backlog
- Sprint Backlog
- Increment
- Definition of Done (DoD)

---

## 3. Realisation de la 1ere Release (Janvier - Fevrier 2025)

### 3.1 Introduction

La Release 1 a etabli le socle technique et fonctionnel du produit. La priorite etait la securisation de la plateforme et la mise en place des premiers modules administratifs.

### 3.2 Backlog produit de la Release 1

| Epic | User stories principales | Priorite |
|---|---|---|
| R1-E1 Authentification et securite | inscription, connexion, gestion des roles, changement/reinitialisation mot de passe | Haute |
| R1-E2 Gestion utilisateurs et administration initiale | gestion comptes, categories globales, dashboard admin de base | Haute |

### 3.3 Diagramme de cas d'utilisation global du Release 1

Acteurs : Visiteur, Client, Vendeur, Administrateur.  
Cas majeurs :
- S'inscrire / Se connecter
- Gerer profil et session
- Gerer utilisateurs et categories (admin)
- Acceder aux interfaces selon role (client, vendeur, admin)

### 3.4 Sprint 1 : Authentification et gestion des utilisateurs

#### 3.4.1 Objectifs du Sprint 1

- Mettre en place un flux d'authentification complet et securise.
- Integrer la gestion des permissions par roles.
- Rendre les routes frontend coherentes avec les profils.

#### 3.4.2 Diagramme de cas d'utilisation general du Sprint 1

Cas d'utilisation :
- Creer compte utilisateur
- Se connecter
- Modifier mot de passe
- Recuperer acces (mot de passe oublie)
- Redirection automatique selon role

#### 3.4.3 Analyse et conception du Sprint 1

Conception backend :
- Module `AuthModule` pour la logique de securite.
- DTO de validation pour les entrees sensibles.
- JWT pour la session stateless.
- Preparation du module mail pour les operations de recuperation.

Conception frontend :
- Ecrans `SignIn`, `SignUp`, `ResetPassword`.
- Guards de navigation via `router.beforeEach`.
- Redirection role-based (`admin`, `seller`, `client`).

Critere d'acceptation :
- Un utilisateur valide accede a son espace.
- Un utilisateur non autorise est bloque.
- Les ecrans d'authentification sont fonctionnels bout en bout.

#### 3.4.4 Realisation du Sprint 1

Elements implementes :
- Endpoints d'authentification dans le backend NestJS.
- Configuration de la securite et des routes protegees.
- Integration des formulaires frontend et du stockage utilisateur.
- Tests manuels des parcours de connexion/deconnexion et role routing.

### 3.5 Sprint 2 : Administration de base et gestion des categories

#### 3.5.1 Objectifs du Sprint 2

- Structurer l'espace administrateur.
- Implementer la gestion des categories.
- Amorcer les tableaux de supervision admin.

#### 3.5.2 Diagramme de cas d'utilisation du Sprint 2

Cas d'utilisation :
- Ajouter / modifier / supprimer categorie
- Consulter listes utilisateurs, clients, vendeurs
- Superviser les donnees clees depuis dashboard

#### 3.5.3 Analyse et conception du Sprint 2

Conception backend :
- `CategoryModule` avec DTO create/update.
- Renforcement `UserModule` pour besoins d'administration.
- Preparation `DashboardModule` pour indicateurs.

Conception frontend :
- Vues admin : dashboard, categories, utilisateurs, vendeurs, clients.
- Layout dedie admin + navigation rolee.

Definition of Done du sprint :
- CRUD categorie operationnel.
- Interface admin stable.
- Controles d'acces admin actifs.

#### 3.5.4 Realisation du Sprint 2

Livrables :
- Pages admin et composants de gestion.
- Services API relies au backend.
- Stabilisation UX (chargement, messages d'erreurs, redirections).

### 3.6 Conclusion de la Release 1

La Release 1 a valide les fondations : securite, gestion des roles, architecture modulaire initiale, espace admin de base. Cette assise a permis de passer a la valeur metier e-commerce dans la release suivante.

---

## 4. Realisation de la 2eme Release (Mars - Avril 2025)

### 4.1 Introduction

La Release 2 est centree sur le coeur metier marketplace : produits, catalogue, panier, commandes, avis et interactions client-vendeur.

### 4.2 Backlog produit de la Release 2

| Epic | User stories principales | Priorite |
|---|---|---|
| R2-E1 Gestion produit et catalogue | CRUD produits vendeur, consultation catalogue, fiche produit detaillee | Haute |
| R2-E2 Parcours d'achat et interaction | panier, checkout, commande, avis, wishlist, follow vendeur | Haute |

### 4.3 Diagramme de cas d'utilisation global du Release 2

Acteurs : Client, Vendeur, Administrateur.  
Cas majeurs :
- Publier et gerer produits (vendeur)
- Consulter catalogue, produits et marche vendeur (client)
- Ajouter au panier et passer commande
- Laisser avis / suivre vendeurs / gerer wishlist

### 4.4 Sprint 3 : Gestion des produits et visualisation catalogue

#### 4.4.1 Objectifs du Sprint 3

- Implementer le module produit complet.
- Relier les interfaces vendeur aux APIs metier.
- Rendre le catalogue consultable et evolutif.

#### 4.4.2 Diagramme de cas d'utilisation du Sprint 3

Cas d'utilisation :
- Ajouter produit
- Modifier produit
- Supprimer produit
- Lister produits
- Consulter detail d'un produit

#### 4.4.3 Analyse et conception du Sprint 3

Conception backend :
- `ProductModule`, `ProductController`, `ProductService`, `product.entity`.
- DTO creation/mise a jour produit.
- `UploadModule` pour gestion des medias.

Conception frontend :
- Vues vendeur : `ProductsList`, `AddProduct`, `EditProduct`.
- Vues client : `Catalog`, `ShopSingle`, `MarketPage`.
- Amelioration des parcours d'affichage et navigation.

#### 4.4.4 Realisation du Sprint 3

Livrables :
- CRUD produit integre (frontend/backend).
- Affichage catalogue et pages produits.
- Gestion d'images produit et validation de formulaires.
- Tests de non-regression sur le parcours vendeur.

### 4.5 Sprint 4 : Panier, commandes, avis et engagement utilisateur

#### 4.5.1 Objectifs du Sprint 4

- Construire un parcours d'achat complet.
- Ajouter la couche transactionnelle (commande).
- Introduire l'engagement social et la confiance (avis/follow/wishlist).

#### 4.5.2 Diagramme de cas d'utilisation du Sprint 4

Cas d'utilisation :
- Ajouter article au panier
- Modifier quantite / supprimer article
- Valider commande (checkout)
- Publier un avis
- Suivre un vendeur / gerer wishlist

#### 4.5.3 Analyse et conception du Sprint 4

Conception backend :
- `CartModule`, `OrderModule`, `ReviewModule`, `SellerFollowModule`.
- Entites de transaction : `CartItem`, `Order`, `OrderItem`, `Review`.

Conception frontend :
- `Cart.vue`, `checkout.vue`, `WishList.vue`, `FollowingMarket.vue`.
- Liaison aux routes protegees et au profil utilisateur.

Controle qualite :
- Coherence des montants
- Gestion des erreurs API
- Verification role utilisateur sur actions sensibles

#### 4.5.4 Realisation du Sprint 4

Livrables :
- Panier dynamique et persistant.
- Workflow checkout -> creation commande.
- Integration des avis et du suivi vendeur.
- Validation de scenarios de bout en bout.

### 4.6 Conclusion de la Release 2

Cette release a materialise la valeur business principale : mise en relation vendeur-client et conversion en commande dans un flux fonctionnel continu.

---

## 5. Realisation de la 3eme Release : Module IA et Infrastructure DevOps (Mai - Juin 2025)

### 5.1 Introduction

La Release 3 vise la maturite du produit avec un module IA d'assistance et une infrastructure de deploiement industrialisee.

### 5.2 Backlog produit de la Release 3

| Epic | User stories principales | Priorite |
|---|---|---|
| R3-E1 Assistant intelligent | dialogue utilisateur, recommandation produit, reponse contextuelle | Moyenne/Haute |
| R3-E2 Docker et DevOps | conteneurisation front/back/db, orchestration compose, verification run | Haute |

### 5.3 Sprint 5 : Module IA - Assistant intelligent

#### 5.3.1 Objectifs du Sprint 5

- Concevoir un assistant conversationnel integre.
- Connecter une logique de traitement IA cote backend.
- Ameliorer l'accompagnement utilisateur en navigation.

#### 5.3.2 Diagramme de cas d'utilisation du Sprint 5

Cas d'utilisation :
- Poser une question sur le catalogue
- Recevoir orientation/recommandation
- Obtenir assistance rapide avant achat

#### 5.3.3 Analyse et conception du Sprint 5

Conception backend :
- `ChatModule`, `ChatController`, `ChatService`.
- DTO `chat-request.dto`.
- Service de preparation contextuelle et generation de reponse.

Conception frontend :
- Composant `AsmadChatWidget`.
- Integration dans les pages a forte interaction.

#### 5.3.4 Realisation du Sprint 5

Livrables :
- Flux complet question/reponse utilisateur.
- Liaison UI -> API chat.
- Gestion des erreurs/timeouts.
- Validation de scenarios de support conversationnel.

### 5.4 Sprint 6 : Dockerisation et Infrastructure DevOps

#### 5.4.1 Objectifs du Sprint 6

- Rendre le projet facilement deployable.
- Uniformiser les environnements dev/test/demo.
- Preparer l'integration continue.

#### 5.4.2 Dockerisation du backend

- Construction image backend NestJS.
- Injection des variables d'environnement.
- Exposition des ports et regles de dependance.

#### 5.4.3 Dockerisation du frontend

- Build de l'application Vue.
- Conteneurisation serveur statique du frontend.
- Alignement URL API avec environnement conteneurise.

#### 5.4.4 Base de donnees MySQL en conteneur

- Service MySQL dedie.
- Persistance via volume.
- Parametrage reseau interne.

#### 5.4.5 Integration via Docker Compose

- Orchestration multi-services (frontend, backend, database).
- Demarrage simplifie de l'ensemble applicatif.

#### 5.4.6 Tests et verifications

- Test de disponibilite globale des services.
- Verifications sur endpoints critiques (auth, produit, panier, commande, chat).
- Controle des logs de demarrage et robustesse.

#### 5.4.7 Resultats obtenus

- Deploiement simplifie.
- Reproductibilite des environnements.
- Base prete pour evolution CI/CD.

---

## 6. Planning global Scrum (Janvier - Juin 2025)

| Mois | Sprint | Theme principal | Sortie attendue |
|---|---|---|---|
| Janvier 2025 | Sprint 1 | Authentification et utilisateurs | Connexion securisee et gestion roles |
| Fevrier 2025 | Sprint 2 | Administration et categories | Interface admin et gestion categorie |
| Mars 2025 | Sprint 3 | Produits et catalogue | CRUD produit + navigation catalogue |
| Avril 2025 | Sprint 4 | Panier, commandes, avis | Parcours d'achat complet |
| Mai 2025 | Sprint 5 | Assistant IA | Support conversationnel integre |
| Juin 2025 | Sprint 6 | Docker et DevOps | Deploiement conteneurise stable |

---

## 7. Risques, mitigations et gouvernance qualite

### 7.1 Risques principaux
- Derive de perimetre fonctionnel (scope creep)
- Dette technique due a l'augmentation rapide du code
- Defauts d'integration front/back en fin de sprint
- Delai eleve sur fonctionnalites innovantes (IA)

### 7.2 Actions de mitigation
- Priorisation stricte par valeur metier
- Revues de code et points techniques hebdomadaires
- Tests d'integration incrementaux
- Decoupage fin des user stories IA

### 7.3 Qualite et Definition of Done globale
- Code compile et demarre sans regression
- Validation fonctionnelle PO
- Verification des routes securisees
- Documentation minimale de release mise a jour

---

## 8. Conclusion generale

La conduite Agile Scrum sur six mois a permis de transformer progressivement le projet marketplace en solution complete, en partant d'un socle securise (Release 1), en delivrant le coeur business e-commerce (Release 2), puis en ajoutant des capacites avancees IA et DevOps (Release 3).  

La structuration en epics, user stories et sprints a facilite la priorisation, la maitrise des risques et la livraison continue de valeur. Cette demarche est conforme aux attentes d'un projet de fin d'etudes niveau ingenieur avec une logique de pilotage entreprise.

---

## 9. Annexes proposees pour la version memoire

- Annexe A : Product Backlog detaille (tableau complet US + priorite + statut)
- Annexe B : Diagrammes UML Use Case par release et sprint
- Annexe C : Captures des interfaces (admin, vendeur, client, chat)
- Annexe D : Extraits de tests et verification de deploiement
- Annexe E : Retrospectives sprint et actions d'amelioration
