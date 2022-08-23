var axios = require('axios');
const FormData = require('form-data')



async function getToken() {

    var data = JSON.stringify({
        "credentials": {
            "username": "chatanonymous",
            "password": "Aug@2022",
            "domain": "DEF"
        }
    });

    var config = {
        method: 'post',
        url: 'https://prod-bl.qp.akasaair.com//api/nsk/v2/token',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {

        let response = await axios(config)
        console.log("token --> ", response.data.data.token)
        return response.data.data.token

    } catch (error) {

        console.log(error);
        return "error"
    }


}

var token = "";

async function getLegkeyByPNR(details) {
    token = await getToken();

    var config = {
        method: 'get',
        url: 'https://prod-bl.qp.akasaair.com/api/nsk/v2/bookings/?RecordLocator={RecordLocator}&{var1}={var2}',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    };

    if (details.emailid) {
        config.url = config.url.replace("{RecordLocator}", details.pnr);
        config.url = config.url.replace("{var1}", "EmailAddress");
        config.url = config.url.replace("{var2}", details.emailid);
    }
    else {
        config.url = config.url.replace("{RecordLocator}", details.pnr);
        config.url = config.url.replace("{var1}", "LastName");
        config.url = config.url.replace("{var2}", details.lastname);
    }


    try {

        let response = await axios(config)
        // console.log("pnr details --> ", response.data.data);
        return response.data

    } catch (error) {

        console.log("error in finding legkey --> ", error);
        return "error"
    }


}




async function getLegKeyByflightNum(details) {
    token = await getToken();

    var data = JSON.stringify({
        "beginDate": details.date,          
        "identifier": details.flightNum
    });

    var config = {
        method: 'post',
        url: 'https://prod-bl.qp.akasaair.com/api/nsk/v1/trip/info',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        let resp = await axios(config)


        console.log("aaaa -->", resp.data);
        return resp.data
    } catch (error) {

        console.log(error);
        return "error"

    }


}


async function getLegKeyByOriDestin(details) {
    token = await getToken();

    var data = JSON.stringify({
        "beginDate": details.date,
        "originStations": [
            details.origin
        ],
        "destinationStations": [
            details.destination
        ]
    });

    var config = {
        method: 'post',
        url: 'https://prod-bl.qp.akasaair.com/api/nsk/v1/trip/info',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        data: data
    };

   
    try {
        let resp = await axios(config)


        console.log("aaaa -->", resp.data);
        return resp.data
    } catch (error) {

        console.log(error);
        return "error"

    }
}




async function getStatusByLegKey(flightLegKey) {


    console.log("flight legkey --> ", flightLegKey);


    var config = {
        method: 'get',
        url: 'https://prod-bl.qp.akasaair.com/api/nsk/v2/trip/info/{legkey}/status',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    };

    config.url = config.url.replace("{legkey}", flightLegKey)

    try {

        let reponse = await axios(config);
        let times = reponse.data
        console.log("status --- >", times);
        return times
    } catch (error) {

        console.log(error);
        return "error"
    }

}



// getToken()
// let ss = {
//     date: "2022--07",
//     flightNum: "1101"
// }

// getLegKeyByflightNum(ss)

async function downloadTicket (details) {
    console.log("DETAILS => " , details);

    var config = {
        method: 'get',
        url: details.url,
        headers: { }
    };

    try {

        let response = await axios(config)
        console.log("status --- >", response.status);
        return response
    } catch (error) {

        console.log(error);
        return "error"
    }
}

async function LinkShortner(link){

    var data = new FormData();
    data.append('userid', '2000190213');
    data.append('password', 'bbF8c6P9');
    data.append('sendto', '918971823925');
    data.append('url', link);

    let url = "https://products.smsgupshup.com/urlshortner/incoming.php";
    var config = {
        method: 'post',
        url: url,
        headers: { 
          ...data.getHeaders()
        },
        data : data
    };

    try {
        let response = await axios(config)
        console.log("SHORT URL --- >", response.data.URL);
        return response
    } catch (error) {

        console.log(error);
        return "error"
    }
}

module.exports = { getLegkeyByPNR, getLegKeyByflightNum, getLegKeyByOriDestin, getStatusByLegKey , downloadTicket , LinkShortner }