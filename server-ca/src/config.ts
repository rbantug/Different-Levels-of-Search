function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

const config = {
  meiliHost: required("MEILI_HOST"),
  meiliMasterKey: required("MEILI_MASTER_KEY"),
  ollamaHost: required("OLLAMA_HOST"),
  ollamaModel: required("OLLAMA_MODEL"),
};

export default config;
