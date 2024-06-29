import { API } from '../base';

const handleChangeEnterWord = async (word, axiosJWT, accessToken, lng) => {
  try {
    const response = await axiosJWT.post(
      API.BAD_WORD.CHECK(word),
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    if (response.data && response.data.exists) {
      return response.data.message;
    } else {
      return null;
    }
  } catch (error) {
    return error.response.data.message;
  }
};

const addBadWord = async (word, axiosJWT, accessToken, lng) => {
  try {
    const response = await axiosJWT.post(
      API.BAD_WORD.CREATE,
      {
        word: word,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

const deleteBadWord = async (wordId, axiosJWT, accessToken, lng) => {
  try {
    const response = await axiosJWT.delete(API.BAD_WORD.DELETE(wordId), {
      headers: {
        token: `Bearer ${accessToken}`,
        'Accept-Language': lng,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const updateBadWord = async (
  wordId,
  newBadWord,
  axiosJWT,
  accessToken,
  lng,
) => {
  try {
    const response = await axiosJWT.put(
      API.BAD_WORD.UPDATE(wordId),
      {
        word: newBadWord,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          'Accept-Language': lng,
        },
      },
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export { handleChangeEnterWord, addBadWord, deleteBadWord, updateBadWord };
