'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
          //nanboku line
          {
              name: 'testuser-sendai-Nagamachiminami',
              email: "testuser-sendai-Nagamachiminami@gmail.com",
              lat: "38.224834023697724",
              lng: "140.87674995950186",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendai-Izumichuo',
              email: "testuser-sendai-Izumichuo@gmail.com",
              lat: "38.324116209678955",
              lng: "140.87973015802174",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendai-Asahigaoka',
              email: "testuser-sendai-Asahigaoka@gmail.com",
              lat: "38.29578648919703",
              lng: "140.8831985908675",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendai-Kitayobancho',
              email: "testuser-sendai-Kitayobancho@gmail.com",
              lat: "38.26693312451375",
              lng: "140.87094284179656",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          //touzai line
          {
              name: 'testuser-sendai-Yagiyama',
              email: "testuser-sendai-Yagiyama@gmail.com",
              lat: "38.243035025969384",
              lng: "140.84363103178197",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendai-Nishikoen',
              email: "testuser-sendai-Nishikoen@gmail.com",
              lat: "38.25914796976766",
              lng: "140.86452892174478",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendai-Rokuchounome',
              email: "testuser-sendai-Rokuchounome@gmail.com",
              lat: "38.25105141261302",
              lng: "140.93551714829863",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendai-Renhou',
              email: "testuser-sendai-Renhou@gmail.com",
              lat: "38.251130495263176",
              lng: "140.89311892808226",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },

          //tohoku univ
          {
              name: 'testuser-tohokuUniv-Kawauchi',
              email: "testuser-tohokuUniv-Kawauchi@gmail.com",
              lat: "38.25908275751174",
              lng: "140.85200894262107",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-tohokuUniv-Katahira',
              email: "testuser-tohokuUniv-Katahira@gmail.com",
              lat: "38.254456165671606",
              lng: "140.87406547484161",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-tohokuUniv-Aobayama',
              email: "testuser-tohokuUniv-Aobayama@gmail.com",
              lat: "38.25536393621288",
              lng: "140.83429942900722",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },

          //joubansen
          {
              name: 'testuser-joubansen-Iwanuma',
              email: "testuser-joubansen-Iwanuma@gmail.com",
              lat: "38.11182315887204",
              lng: "140.86377827263206",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },

          //sendai airport access line
          {
              name: 'testuser-sendaiAirportAccessLine-Natori',
              email: "testuser-sendaiAirportAccessLine-Natori@gmail.com",
              lat: "38.17335529175566",
              lng: "140.88248113244205",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendaiAirportAccessLine-Minamisendai',
              email: "testuser-sendaiAirportAccessLine-Minamisendai@gmail.com",
              lat: "38.197206614019834",
              lng: "140.88260854504458",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendaiAirportAccessLine-Mitazono',
              email: "testuser-sendaiAirportAccessLine-Mitazono@gmail.com",
              lat: "38.15963950394463",
              lng: "140.91730245650885",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-sendaiAirportAccessLine-Tatekoshi',
              email: "testuser-sendaiAirportAccessLine-Tatekoshi@gmail.com",
              lat: "38.14326611737433",
              lng: "140.88008033320864",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },

          // others
          {
              name: 'testuser-others-Ieonmall',
              email: "testuser-others-Ieonmall@gmail.com",
              lat: "38.163600392928196",
              lng: "140.89534385769628",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-others-Jusanzuka',
              email: "testuser-others-Jusanzuka@gmail.com",
              lat: "38.161149880117016",
              lng: "140.868289570603",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },


          //tokyo station
          {
              name: 'testuser-TokyoST-Marunouthihiroba',
              email: "testuser-TokyoST-Marunouthihiroba@gmail.com",
              lat: "35.68160419188302",
              lng: "139.76561224626187",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-TokyoST-Koukyo',
              email: "testuser-TokyoST-Koukyo@gmail.com",
              lat: "35.685322212190776",
              lng: "139.75280667723376",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-TokyoST-Kanda',
              email: "testuser-TokyoST-Kanda@gmail.com",
              lat: "35.69181040868385",
              lng: "139.77008076179177",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },

          //shinjuku station
          {
              name: 'testuser-ShinjukuST',
              email: "testuser-ShinjukuST@gmail.com",
              lat: "35.68957210526298",
              lng: "139.700132876741",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-ShinjukuST-ShinjukuGyoen',
              email: "testuser-ShinjukuST-ShinjukuGyoen@gmail.com",
              lat: "35.68531675341999",
              lng: "139.71049449020492",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              name: 'testuser-ShinjukuST-Tokyotochou',
              email: "testuser-ShinjukuST-Tokyotochou@gmail.com",
              lat: "35.689791970515756",
              lng: "139.6922302259864",
              active: true,
              createdAt: new Date(),
              updatedAt: new Date()
          },

        ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};

