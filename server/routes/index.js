const keystone = require('keystone');
const importRoutes = keystone.importer(__dirname);

const Donation = keystone.list('Donation');

module.exports = (app) => {
  app.all('/api*', keystone.middleware.cors);
  app.options('/api*', (req, res) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
    res.send(200);
  });

  const api = keystone.express.Router();
  app.use('/api', api);
  api.get('/donations', (req, res) => {
    const donations = [];
    Donation.model
      .findOne({ isProcessed: false, })
      .sort({ createdAt: -1 })
      .exec((err, donation) => {
        if (donation) donations.push(donation);
        return res.json({
          success: true,
          donations,
        });
      });
  });
  api.get('/donation-notifications', (req, res) => {
    const donations = [];
    Donation.model
      .findOne({ isProcessed: true, isNotified: false })
      .sort({ createdAt: -1 })
      .exec((err, donation) => {
        if (donation) {
          donation.isNotified = true;
          donation.save(() => {
            return res.json({
              success: true,
              donations: [donation],
            });
          });
        } else {
          return res.json({
            success: true,
            donations: [],
          });
        }
      });
  });
  api.post('/process-donation/:id', (req, res) => {
    Donation.model
      .findById(req.params.id)
      .sort({ createdAt: -1 })
      .exec((err, donation) => {
        donation.isProcessed = true;
        donation.save((err) => {
          res.json({ success: true });
          // TODO: SAVE TO BLOCKCHAIN
        });
      });
  });
  api.post('/donations', (req, res) => {
    console.log(req.body, req.params);
    const {
      cause,
      donator,
    } = req.body;

    const donation = new Donation.model({
      cause: cause,
      donator: donator,
    });

    donation.save(() => {
      res.json({
        success: true,
      });
    });
  });
}