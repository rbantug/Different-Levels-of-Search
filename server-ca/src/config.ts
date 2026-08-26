function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

const config = {
  meiliMasterKey: required("MEILI_MASTER_KEY"),
  ollamaHost: required("OLLAMA_HOST"),
  ollamaModel: required("OLLAMA_MODEL"),
};

export default config;
