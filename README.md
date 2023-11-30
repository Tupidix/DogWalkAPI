# ArchiOWeb - DogWalk

## Principe de l'API

Faire une application mobile micro-communautaire de "baladeurs de chiens".

Nous souhaitons utiliser les chiens, les propriétaires et leur localisation comme sources pour pouvoir les afficher sur une map que seules les personnes se promenant actuellement voient.
Le principe est de ne pas s'embêter à promener son chien seul, mais d'en profiter pour faire des rencontres !

Pour ce qui est des API hardware nous utiliserons donc la géolocalisation ainsi que les notifications pour les avertir quand quelqu'un lance une promenade.

## Prises de notes en classe

Il y aura trois ressources

api/users
api/dogs
api/walks

Ces trois ressources seront agrégées entre elles

Sur l'écran principal, nous aurons une map avec des pins sur la carte où l'on voit les promeneurs en train de faire une promenade.

Au dessous, nous avons une liste avec ces même promeneurs qui sont triés par ordre de proximité de l'utilisateur.

Chaque utilisateur aura possibilité d'indiquer une tension entre son chien et un autre, cette fonctionnalité ne pourra être utilisée que par la personne susmentionnée et non pas par des utilisateurs tiers.

Dès qu'un conflit est enregistré, les promeneurs en questions apparaitrons toujours sur la carte ou dans la liste (afin de savoir où il ne faut pas y aller) mais de manière grisée. De plus, si un utilisateur en promenade est à une distance de 500m d'un "ennemi", une notification apparaîtra pour le lui dire.

## WebSocket

Vous pouvez vous connecter à notre WebSocket afin de recevoir des notifications grâce à l'adresse "ws://dogwalkapi.onrender.com" sur Postman. Il y a une notification qui se lance quand une route est créée et quand un utilisateur rejoins une route.