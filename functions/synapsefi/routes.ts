export default {
  "GET /test": "functions/synapsefi/main.test",
  // createSubscription
  "POST /subscriptions": "functions/synapsefi/main.createSubscriptions",
  // getUser
  "GET /users/{userId}": "functions/synapsefi/main.getUser",
  // generateUBO
  "PATCH /users/{userId}/ubo": "functions/synapsefi/main.generateUbo",
  // updateKyc
  "PATCH /users/{userId}": "functions/synapsefi/main.updateUser",
  // createUser
  "POST /users": "functions/synapsefi/main.createUser",
  // oauth
  "POST /oauth/{userId}": "functions/synapsefi/main.authenticate",
  // createNode
  "POST /users/{userId}/nodes": "functions/synapsefi/main.createNode",
  // createSubnet
  "POST /users/{userId}/nodes/{nodeId}/subnets":
    "functions/synapsefi/main.createSubnet",
  // updateSubnet
  "PATCH /users/{userId}/nodes/{nodeId}/subnets/{subnetId}":
    "functions/synapsefi/main.updateSubnet",
  // shipCard
  "PATCH /users/{userId}/nodes/{nodeId}/subnets/{subnetId}/ship":
    "functions/synapsefi/main.shipCard",
  // getCardShipment
  "GET /users/{userId}/nodes/{nodeId}/subnets/{subnetId}/ship/{shipmentId}":
    "functions/synapsefi/main.getCardShipment",
  // getAllSubnets
  "GET /users/{userId}/nodes/{nodeId}/subnets":
    "functions/synapsefi/main.getAllSubnets",
  // getSubnet
  "GET /users/{userId}/nodes/{nodeId}/subnets/{subnetId}":
    "functions/synapsefi/main.getSubnet",
  // verifyAddress
  "POST /address-verification": "functions/synapsefi/main.verifyAddress",
};
