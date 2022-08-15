const elasticsearch = require('elasticsearch');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ServiceResult = require('../api-models/ServiceResult');
const elasticClient = new elasticsearch.Client({
    host: 'localhost:9200'
});
const logger = require('./logger-factory')('Tools - ElasticSearch');

async function storeReference(reference) {
    logger.info(
        `Indexing Reference by ${reference.id} Id and ${reference.title} Title`
    );
    try {
        await elasticClient.index({
            index: 'search_index',
            id: reference['id'],
            type: 'reference',
            body: {
                id: reference['id'],
                title: reference['title'],
                text: reference['text']
            }
        });

        logger.info(
            `Indexed Reference Successfully by ${subject.id} Id and ${subject.title} Title`
        );
    } catch (e) {
        logger.error(
            `Error accorded among indexing Reference by ${subject.id} Id and ${subject.title} Title > ${e}`
        );
    }
}

async function storeSubject(subject) {
    logger.info(
        `Indexing Subject by ${subject.id} Id and ${subject.title} Title`
    );
    try {
        await elasticClient.index({
            index: 'search_index',
            id: subject['id'],
            type: 'subject',
            body: {
                id: subject['id'],
                title: subject['title']
            }
        });

        logger.info(
            `Indexed Subject Successfully by ${subject.id} Id and ${subject.title} Title`
        );
    } catch (e) {
        logger.error(
            `Error accorded among indexing Subject by ${subject.id} Id and ${subject.title} Title > ${e}`
        );
    }
}

async function storeGuide(guide) {
    logger.info(`Indexing Guide by ${guide.id} Id and ${guide.title} Title`);
    try {
        await elasticClient.index({
            index: 'search_index',
            id: guide['id'],
            type: 'guide',
            body: {
                id: guide['id'],
                title: guide['title'],
                text: guide['text']
            }
        });

        logger.info(
            `Indexed Guide Successfully by ${guide.id} Id and ${guide.title} Title`
        );
    } catch (e) {
        logger.error(
            `Error accorded among indexing Guide by ${guide.id} Id and ${guide.title} Title > ${e}`
        );
    }
}

async function deleteSubject(subject) {
    logger.info(
        `Deleting index of Subject by ${subject.id} Id and ${subject.title} Title`
    );
    try {
        await elasticClient.delete({
            index: 'search_index',
            id: subject['id'],
            type: 'subject',
        });

        logger.info(
            `Deleted index of Subject Successfully by ${subject.id} Id and ${subject.title} Title`
        );
    } catch (e) {
        logger.error(
            `Error accorded among deleting index of Subject by ${subject.id} Id and ${subject.title} Title > ${e}`
        );
    }
}

async function deleteGuide(guide) {
    logger.info(
        `Deleting index of Guide by ${guide.id} Id and ${guide.title} Title`
    );
    try {
        await elasticClient.delete({
            index: 'search_index',
            id: guide['id'],
            type: 'guide',
        });

        logger.info(
            `Deleted index of Guide Successfully by ${guide.id} Id and ${guide.title} Title`
        );
    } catch (e) {
        logger.error(
            `Error accorded among deleting index of Guide by ${guide.id} Id and ${guide.title} Title > ${e}`
        );
    }
}

async function deleteReference(reference) {
    logger.info(
        `Deleting index of Reference by ${reference.id} Id and ${reference.title} Title`
    );
    try {
        await elasticClient.delete({
            index: 'search_index',
            id: reference['id'],
            type: 'reference',
        });

        logger.info(
            `Deleted index of Reference Successfully by ${reference.id} Id and ${reference.title} Title`
        );
    } catch (e) {
        logger.error(
            `Error accorded among deleting index of Reference by ${reference.id} Id and ${reference.title} Title > ${e}`
        );
    }
}

async function searchInElastic(keyword) {
    let results = [];

    try {
        let temp = await elasticClient.search({
            index: 'search_index',
            q: `title:*${keyword}* OR text:*${keyword}*`
        });

        temp.hits.hits.map((item) => {
            results.push(item._source);
        });

    } catch (exception) {
        throw exception;
    }

    return results;
}

module.exports = {
    storeSubject,
    storeGuide,
    storeReference,
    deleteSubject,
    deleteGuide,
    deleteReference,
    searchInElastic,
    logger
};
