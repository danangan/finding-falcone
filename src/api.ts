export function fetchToken() {
    return fetch('https://findfalcone.herokuapp.com/token', {
        method: 'POST',
        headers: {
            "Accept" : "application/json"
        }
    }).then(res => res.json())
}

export function fetchPlanets() {
  return fetch('https://findfalcone.herokuapp.com/planets').then(res => res.json())
}

export function fetchVehicles() {
  return fetch('https://findfalcone.herokuapp.com/vehicles').then(res => res.json())
}

export function findfalcone(payload) {
  return fetch('https://findfalcone.herokuapp.com/find', {
    method: 'POST',
    headers: {
      "Accept" : "application/json",
      "Content-Type" :"application/json"
    },
    body: JSON.stringify(payload)
  }).then(res => res.json())
}
