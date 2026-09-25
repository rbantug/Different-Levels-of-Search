function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

const config = {
  apiUrl: required('VITE_API_URL', import.meta.env.VITE_API_URL),
}

export default config