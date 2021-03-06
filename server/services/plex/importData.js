import Promise from 'bluebird';
import plexApi from './plexApi';
import models from '../../db/models';
import config from '../../../config';
import MovieDb from 'moviedb-promise';
import logger from '../../../config/winston';
import { Op } from 'sequelize';
const mdb = new MovieDb(config.server.movieApiKey);

const updateOrCreate = async (model, where, newItem) => {
  const item = await model.findOne({ where });
  if (!item) {
    const createItem = await model.create(newItem, {
      returning: true,
      plain: true,
      raw: true,
    });
    return { createItem, created: true };
  } else {
    await model.update(
      newItem,
      { where: where },
      { returning: true, plain: true, raw: true },
    );
    return { item, created: false };
  }
};

const importTvPosters = async user => {
  try {
    const mostWatched = await models.PlexLibrary.findAll({
      where: { UserId: user.id, type: 'show', views: { [Op.gt]: 0 } },
    });

    await mostWatched.map(async show => {
      const res = await mdb.searchTv({
        query: show.title.replace(/ *\([^)]*\) */g, ''),
      });
      logger.info(`Poster response ${show.title} ${res.results}`);
      return models.PlexLibrary.update(
        {
          poster_path: res.results[0].poster_path,
        },
        {
          where: { UserId: user.id, title: show.title },
        },
      );
    });
  } catch (error) {
    return error.message;
  }
};

const importSections = async user => {
  const sections = await plexApi.getSections(user);
  const dbSections = await createSections(sections, user);
  return dbSections;
};

const createSections = async (sections, user) => {
  const updatedSections = await Promise.map(sections, section => {
    const newSection = {
      title: section.title,
      type: section.type,
      key: section.key,
      UserId: user.id,
    };
    return updateOrCreate(
      models.PlexSection,
      {
        title: section.title,
        UserId: user.id,
      },
      newSection,
    );
  }).catch(err => {
    logger.error(`createSections ${err}`);
  });
  return updatedSections;
};

const importLibraries = async user => {
  const sections = await plexApi.getSections(user);
  await createSections(sections, user);
  return Promise.map(sections, section => {
    return importLibrary(section.key, user);
  }).catch(err => logger.error(`ImportLibraries ${err}`));
};

const importLibrary = async (sectionKey, user) => {
  const libraryData = await plexApi.getLibraryDataBySection(
    {
      sectionKey,
    },
    user,
  );
  const dbLibraryData = await createLibrary(libraryData, user);
  return dbLibraryData;
};

const createLibrary = async (libraryData, user) => {
  const updatedLibrary = await Promise.map(
    libraryData,
    sectionLibraryData => {
      const newSectionLibraryData = {
        title: sectionLibraryData.title,
        type: sectionLibraryData.type,
        views: sectionLibraryData.views,
        rating_key: sectionLibraryData.ratingKey,
        meta_data_path: sectionLibraryData.key,
        UserId: user.id,
        summary: sectionLibraryData.summary,
        rating: sectionLibraryData.rating,
        year: sectionLibraryData.year,
        genre: JSON.stringify(sectionLibraryData.Genre),
      };
      return updateOrCreate(
        models.PlexLibrary,
        {
          UserId: user.id,
          title: sectionLibraryData.title,
        },
        newSectionLibraryData,
      );
    },
  ).catch(err => console.log(err));
  return updatedLibrary;
};

const importMostWatched = async user => {
  try {
    const sections = await models.PlexSection.findAll({
      where: { UserId: user.id },
    });

    const sectionKeys = sections.map(section => {
      return section.key.toString();
    });

    sections.map(section => section.key.toString());
    return Promise.map(sectionKeys, sectionKey => {
      return importMostWatchedData(sectionKey, user);
    }).catch(err => {
      console.log(err);
    });
  } catch (error) {
    console.log('caught error', error);
  }
};

const importMostWatchedData = async (sectionKey, user) => {
  const mostWatchedData = await plexApi.getMostWatched(
    { sectionKey },
    user,
  );

  const mostWatchedDbData = await updateLibrary(
    mostWatchedData,
    user,
  );
  return mostWatchedDbData;
};

const updateLibrary = async (libraryData, user) => {
  const updatedLibrary = await Promise.map(libraryData, data => {
    const newData = {
      title: data.title,
      type: data.type,
      views: data.globalViewCount,
      rating_key: data.ratingKey,
      summary: data.summary,
      UserId: user.id,
      rating: data.rating,
      year: data.year,
      genre: JSON.stringify(data.Genre),
    };
    return updateOrCreate(
      models.PlexLibrary,
      {
        UserId: user.id,
        title: data.title,
      },
      newData,
    );
  }).catch(err => {
    console.log('Unable to import most watched', err);
  });
};

export default {
  importSections,
  importLibraries,
  importMostWatched,
  importTvPosters,
};
