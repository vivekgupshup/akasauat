let ss = {
	"data": [
		{
			"date": "2022-08-08T10:05:00",
			"journeys": [
				{
					"designator": {
						"destination": "AMD",
						"origin": "BOM",
						"arrival": "2022-08-08T11:25:00",
						"departure": "2022-08-08T10:05:00"
					},
					"journeyKey": "MjAyMjA4MDggUVAxMTAxIEJPTUFNRA--",
					"segments": [
						{
							"designator": {
								"destination": "AMD",
								"origin": "BOM",
								"arrival": "2022-08-08T11:25:00",
								"departure": "2022-08-08T10:05:00"
							},
							"isSeatmapViewable": true,
							"segmentKey": "IFFQMTEwMSBCT01BTUQ-",
							"identifier": {
								"identifier": "1101",
								"carrierCode": "QP",
								"opSuffix": null
							},
							"legs": [
								{
									"legKey": "NjM3OTU1NDk5MDAwMDAwMDAwIVFQITExMDEhICFCT00hQU1EITM1NzY2",
									"designator": {
										"destination": "AMD",
										"origin": "BOM",
										"arrival": "2022-08-08T11:25:00",
										"departure": "2022-08-08T10:05:00"
									}
								}
							],
							"externalIdentifier": null,
							"segmentType": 0
						}
					]
				},
				{
					"designator": {
						"destination": "AMD",
						"origin": "BOM",
						"arrival": "2022-08-08T15:25:00",
						"departure": "2022-08-08T14:05:00"
					},
					"journeyKey": "MjAyMjA4MDggUVAxMTA3IEJPTUFNRA--",
					"segments": [
						{
							"designator": {
								"destination": "AMD",
								"origin": "BOM",
								"arrival": "2022-08-08T15:25:00",
								"departure": "2022-08-08T14:05:00"
							},
							"isSeatmapViewable": true,
							"segmentKey": "IFFQMTEwNyBCT01BTUQ-",
							"identifier": {
								"identifier": "1107",
								"carrierCode": "QP",
								"opSuffix": null
							},
							"legs": [
								{
									"legKey": "NjM3OTU1NjQzMDAwMDAwMDAwIVFQITExMDchICFCT00hQU1EITM2NTgw",
									"designator": {
										"destination": "AMD",
										"origin": "BOM",
										"arrival": "2022-08-08T15:25:00",
										"departure": "2022-08-08T14:05:00"
									}
								}
							],
							"externalIdentifier": null,
							"segmentType": 0
						}
					]
				}
			]
		}
	]
}

console.log(ss.data[0]);