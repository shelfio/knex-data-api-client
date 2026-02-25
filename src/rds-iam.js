const {Signer} = require('@aws-sdk/rds-signer');

function resolveRegion() {
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

  if (!region) {
    throw new Error('AWS region is required to generate IAM auth token (set AWS_REGION)');
  }

  return region;
}

async function getIamAuthToken({host, port, username, credentials}) {
  const signer = new Signer({
    hostname: host,
    port,
    username,
    region: resolveRegion(),
    credentials,
  });

  return signer.getAuthToken();
}

module.exports = {
  getIamAuthToken,
};
