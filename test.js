var le = require('letsencrypt').create({
  server: 'staging'
});

var opts = {
  domains: ['ajudeumpet.com.br'],
  email: 'contato@ajudeumpet.com.br',
  agreeTos: true
};

le.register(opts).then(function (certs) {
  console.log(certs);
  // privkey, cert, chain, expiresAt, issuedAt, subject, altnames 
}, function (err) {
  console.error(err);
});
