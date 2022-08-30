const router = require('express').Router();
const { getLegkeyByPNR, getLegKeyByflightNum, getLegKeyByOriDestin, getStatusByLegKey } = require('../services/api')
// const roomlevel = require('../model/roomlevel');


router.post("/bypnr", async (req, res) => {
    console.log("dataaaa - ");
    // console.log("dataa -", req.body.workflow.requestVariables.sys_email);
    console.log("dataa -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables

    let flightPnr = workflowVariables.travel_airlines_ticket_pnr_number_with_pnr;
    let userEmail = "";

    let details = {};
    if (workflowVariables.sys_email_Email_ID) {
        userEmail = workflowVariables.sys_email_Email_ID
        details = {
            pnr: flightPnr,
            emailid: userEmail
        }
    } else {
        details = {
            pnr: flightPnr,
            lastname: workflowVariables.any_freetext_last_name
        }
    }

    console.log("user details --> ", details);

    let response = await getLegkeyByPNR(details);

    let errorFlag = false;

    if ((!response.errors || response !== "error") && response.data) {

        console.log("resp --> ", response.data);
        let flightLegKey = response.data.journeys[0].segments[0].legs[0].legKey

        let journeys = response.data[0].journeys
        console.log("journeys length --> ", journeys.length);
        if (journeys.length > 1) {

            let resp = multipleFlights(journeys);

            res.send(resp)

        } else {

            let resp = await getStatusByLegKey(flightLegKey)

            console.log("active flight status --> ", resp);
            let ftimes = resp.data.operationDetails.tripOperationTimes.departureTimes

            let finalMsg = timeDiffMsg(resp.data.operationDetails.identifier.identifier, ftimes)

            if (resp !== "error") {

                res.send({
                    status: "success",
                    "messageCode": "flight_status_message",

                    "messageParams": [
                        finalMsg
                    ]

                })

            } else {
                errorFlag = true
            }
        }


    } else {
        errorFlag = true
    }



    if (errorFlag) {

        res.send({
            status: "success",
            "messageCode": "status_error",
        })
    }

})


router.post("/byflightnum", async (req, res) => {

    console.log("dataa -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables

    let details = {
        date: workflowVariables.sys_date_departure_dd,
        flightNum: workflowVariables.any_freetext_flight_number
    }

    let response = await getLegKeyByflightNum(details)

    let errorFlag = false;

    console.log("----> ", JSON.stringify(response));
    if (!response.errors && response !== "error" && response.data.length != 0) {

        let flightLegKey = response.data[0].journeys[0].segments[0].legs[0].legKey

        let journeys = response.data[0].journeys
        console.log("journeys length --> ", journeys.length);
        if (journeys.length > 1) {

            let resp = multipleFlights(journeys);

            res.send(resp)

        } else {

            let resp = await getStatusByLegKey(flightLegKey)

            console.log("active flight status --> ", resp);
            let ftimes = resp.data.operationDetails.tripOperationTimes.departureTimes

            let finalMsg = timeDiffMsg(resp.data.operationDetails.identifier.identifier, ftimes)

            if (resp !== "error") {

                res.send({
                    status: "success",
                    "messageCode": "flight_status_message",

                    "messageParams": [
                        finalMsg
                    ]

                })

            } else {
                errorFlag = true
            }
        }

    } else {
        errorFlag = true
    }



    if (errorFlag) {

        res.send({
            status: "success",
            "messageCode": "status_error",
        })
    }
})




router.post("/byOriginDestin", async (req, res) => {

    console.log("dataa  -", req.body.workflow);
    let workflowVariables = req.body.workflow.workflowVariables

    let depDate = new Date(workflowVariables.sys_date_departure_date)
    let details = {
        date: depDate.getFullYear,
        origin: cityCodes[workflowVariables.sys_city_departure_city.toLowerCase()],
        destination: cityCodes[workflowVariables.sys_city_arrival_city.toLowerCase()]
    }

    console.log("details --->", details);
    let response = await getLegKeyByOriDestin(details)

    let errorFlag = false;

    console.log("origin  -> ", cityCodes[workflowVariables.sys_city_departure_city]);
    console.log("origin destin ----> ", JSON.stringify(response));
    if (!response.errors && response !== "error" && response.data.length != 0) {

        let flightLegKey = response.data[0].journeys[0].segments[0].legs[0].legKey

        let journeys = response.data[0].journeys
        console.log("journeys length --> ", journeys.length);
        if (journeys.length > 1) {

            let resp = multipleFlights(journeys);

            res.send(resp)

        } else {

            let resp = await getStatusByLegKey(flightLegKey)

            console.log("active flight status --> ", resp);
            let ftimes = resp.data.operationDetails.tripOperationTimes.departureTimes

            let finalMsg = timeDiffMsg(resp.data.operationDetails.identifier.identifier, ftimes)

            if (resp !== "error") {

                res.send({
                    status: "success",
                    "messageCode": "flight_status_message",

                    "messageParams": [
                        finalMsg
                    ]

                })

            } else {
                errorFlag = true
            }
        }

    } else {
        errorFlag = true
    }



    if (errorFlag) {

        res.send({
            status: "success",
            "messageCode": "status_error",
        })
    }
})




router.post("/byLegKey", async (req, res) => {

    console.log("dataa  -", req.body.workflow);
    let flightLegKey = req.body.workflow.requestVariables.options



    console.log("workflowVariables --->", flightLegKey);

    let errorFlag = false;

    let resp = await getStatusByLegKey(flightLegKey)

    console.log("active flight status --> ", resp);
    let ftimes = resp.data.operationDetails.tripOperationTimes.departureTimes

    let finalMsg = timeDiffMsg(resp.data.operationDetails.identifier.identifier, ftimes)

    if (resp !== "error") {

        res.send({
            status: "success",
            "messageCode": "flight_status_message",

            "messageParams": [
                finalMsg
            ]

        })

    } else {
        errorFlag = true
    }




    if (errorFlag) {

        res.send({
            status: "success",
            "messageCode": "status_error",
        })
    }
})





router.post("/sampleresp", async (req, res) => {

    console.log("request body -", req.body);
    console.log("flightList body -", flightList);
    res.send({
        status: "success",
        templateCode: "multiple_flights_status",

        payload: JSON.stringify({
            list: flightList
        }
        )
    })
})




function multipleFlights(journeys) {
    let flightList = []
    for (let i = 0; i < journeys.length; i++) {
        let legK = journeys[i].segments[0].legs[0].legKey
        let flightD = i + 1 + ". " + getKeyByValue(cityCodes, journeys[i].designator.origin) + " ➡️ " + getKeyByValue(cityCodes, journeys[i].designator.destination)
        let depTime = new Date(journeys[i].designator.departure)
        let flightT = "Departs on -> " + depTime.toShortFormat() + " " + depTime.getHours + ":" + depTime.getMinutes

        flightList.push({
            flightDetail: flightD,
            legKey: legK,
            flightDeparture: flightT
        })
    }
    console.log("flightList ", flightList);
    let sendResp = {
        status: "success",
        templateCode: "multiple_flights_status",
        payload: JSON.stringify({
            list: flightList
        }
        )
    }

    return sendResp;
}

function getKeyByValue(object, value) {
    let value = Object.keys(object).find(key => object[key] === value);
    return value.charAt(0).toUpperCase() + value.slice(1)
}


let cityCodes = {
    "bombay": "BOM",
    "ahmedabad": "AMD",
    "bengaluru": "BLR",
    "banglore": "BLR",
    "mumbai": "BOM",
    "kochi": "COK",
    "chennai": "MAA"
}

function timeDiffMsg(identifier, dates) {

    let depDate = new Date(dates.scheduled)

    if (dates.estimated != null) {
        var estDate = new Date(dates.estimated)
    }


    let message = ""

    if (dates.estimated == null || estDate < depDate) {
        message = " is operating as per schedule. ETD: " + depDate.getHours() + ":" + padTo2Digits(depDate.getMinutes()) + " hrs."
    }
    else if (estDate > depDate) {
        message = " is delayed. ETD: " + depDate.getHours() + ":" + padTo2Digits(depDate.getMinutes()) + " hrs."
    }


    return identifier + " of " + depDate.toShortFormat() + message
}



Date.prototype.toShortFormat = function () {

    let monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    let day = this.getDate();

    let monthIndex = this.getMonth();
    let monthName = monthNames[monthIndex];

    let year = this.getFullYear();

    return `${day}-${monthName}`;
}

function padTo2Digits(num) {
	return num.toString().padStart(2, '0');
  }


module.exports = router;