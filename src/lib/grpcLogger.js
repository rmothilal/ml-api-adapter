'use strict'
const eventSDK = require('@mojaloop/event-sdk')
const DefaultEventLogger = require('@mojaloop/event-sdk').DefaultEventLogger
const EventTraceMetadata = require('@mojaloop/event-sdk').EventTraceMetadata
const _ = require('lodash')

let grpcLogger

const trace = async (message, service) => {
  if (!grpcLogger) {
    grpcLogger = new DefaultEventLogger()
  }
  let traceMessage = _.cloneDeep(message)
  traceMessage.metadata.event.type = eventSDK.TraceEventTypeAction.type
  traceMessage.metadata.event.action = eventSDK.TraceEventAction.span
  let response = await grpcLogger.createSpanForMessageEnvelope(traceMessage, service)
  message.metadata.trace = _.cloneDeep(traceMessage.metadata.trace)
  return response
}

const closeSpan = async (span) => {
  if (!grpcLogger) {
    grpcLogger = new DefaultEventLogger()
  }
  return grpcLogger.logSpan(span)
}

const createChildSpan = async (message, service) => {
  if (!grpcLogger) {
    grpcLogger = new DefaultEventLogger()
  }

  let eventTraceMetaData = new EventTraceMetadata(service, message.metadata.trace.traceId, message.metadata.trace.spanId, message.metadata.trace.parentSpanId, message.metadata.trace.sampled, message.metadata.trace.startTimestamp)
  let traceMessage = _.cloneDeep(message)
  traceMessage.metadata.event.type = eventSDK.TraceEventTypeAction.type
  traceMessage.metadata.event.action = eventSDK.TraceEventAction.span
  let response = await grpcLogger.createChildSpanForMessageEnvelope(traceMessage, eventTraceMetaData, service, { startTimestamp: new Date().toISOString() })
  message.metadata.trace = _.cloneDeep(traceMessage.metadata.trace)
  return response
}

module.exports = {
  closeSpan,
  trace,
  createChildSpan
}
