function doGet(e) {
  return ContentService.createTextOutput("✅ doGet working: API is reachable");
}

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const title = requestData.title;
    const questions = requestData.questions;

    if (!title || !questions || !Array.isArray(questions)) {
      throw new Error("Invalid input: 'title' or 'questions' missing");
    }

    const form = FormApp.create(title);

    questions.forEach((q) => {
      const { title, type, options } = q;
      let item;

      switch (type) {
        case "SHORT_ANSWER":
          item = form.addTextItem().setTitle(title);
          break;
        case "PARAGRAPH":
          item = form.addParagraphTextItem().setTitle(title);
          break;
        case "MULTIPLE_CHOICE":
          item = form.addMultipleChoiceItem().setTitle(title).setChoiceValues(options);
          break;
        case "CHECKBOXES":
          item = form.addCheckboxItem().setTitle(title).setChoiceValues(options);
          break;
        case "DROPDOWN":
          item = form.addListItem().setTitle(title).setChoiceValues(options);
          break;
        default:
          throw new Error("Unsupported question type: " + type);
      }
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", url: form.getEditUrl() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
