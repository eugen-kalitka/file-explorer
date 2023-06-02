const parseWsMessage = (data) => {
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    console.log(`Error occurred on parsing incoming message`, e);
    return {};
  }
  return parsedData;
}

export default parseWsMessage;
