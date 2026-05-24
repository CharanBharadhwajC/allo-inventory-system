const autocannon = require("autocannon")

async function run() {

  const result = await autocannon({
    url: "http://localhost:3000/api/reservations",
    method: "POST",
    connections: 20,
    amount: 50,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productId: "cmpjhyb6c0003blxg13u5t8pp",
      warehouseId: "cmpjhyaxf0000blxgv0hrjodq",
      quantity: 1
    })
  })

  console.log({
    totalRequests: result.requests.sent,
    success2xx: result["2xx"],
    conflicts409: result["4xx"],
    errors: result.errors
  })
}

run()