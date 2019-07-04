const tensionThreshold = 10

export const wasStretchedHardEnoughToWakeUp = (sensors) => {
	return sensors.filter(sensor => sensor.tension && sensor.tension > tensionThreshold).filter(Boolean).length > 0
}
