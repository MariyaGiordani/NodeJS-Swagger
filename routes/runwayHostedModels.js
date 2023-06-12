import express from 'express';

const router = express.Router();

//Returns metadata about the Hosted Model
let model = router.get("/v1/", (req, res) => {
    const model = new rw.HostedModel({
        url: 'https://my-model.hosted-models.runwayml.cloud/v1',
        // not required for public models
        //token: 'my-private-hosted-model-token',
    });

	res.send(model);
    return model;
});

//Returns the input/output spec of /v1/query
router.get("/v1/info", async (req, res) => {
	const info = await model.info();

	res.send(info);
});


//Is used to run the model on input and produce output
router.post("/vi/query", async (req, res) => {
  try {
    const inputs = {
      "prompt": "Finish my sentence",
      "max_characters": 512,
    };
    
    // Replace this Hosted Model URL with your own
    fetch("https://example-text-generator.hosted-models.stage.runwayml.cloud/v1/query", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer <token>", // Replace <token> with your Hosted Models's authorization token
      },
      body: JSON.stringify(inputs)
    })
    .then(response => response.json())
    .then(outputs => {
      const { generated_text, encountered_end } = outputs;
      // use the outputs in your project
      console.log(`The model responded to the prompt like so: ${generated_text}`)
      if (encountered_end) {
        console.log(`The model produced the end of text character, so it thinks its job is done`)
      }
    })
    const result = await model.query({
      prompt: 'Hey text generation model, finish my sentence',
    });
    res.send(result)
  } catch (error) {
    return res.status(500).send(error);
  }
});