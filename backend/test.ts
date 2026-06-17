import { Elysia, t } from elysia;
import { FormData } from undici;

const app = new Elysia()
  .post(/, ({ body }) => {
    return { typeOfAttributes: typeof body.attributes, value: body.attributes };
  }, {
    body: t.Object({ attributes: t.Any() })
  })
  .listen(8001);

const fd = new FormData();
fd.append(attributes, {"hello":"world"});

fetch(http://localhost:8001/, { method: POST, body: fd })
  .then(async r => console.log(await r.json()))
  .finally(() => app.stop());
