const keystone = require('keystone');

const Donation = new keystone.List('Donation');

Donation.add({
  isProcessed: { type: Boolean, default: false },
  isNotified: { type: Boolean, default: false },
  cause: { type: String },
  donator: { type: String },
  donatee: { type: String },
  createdAt: { type: Date, default: Date.now },
});

Donation.schema.set('usePushEach', true);

Donation.register();