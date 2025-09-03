// Script rápido para probar la conexión con Strapi Cloud
const axios = require("axios")

const STRAPI_URL = "https://thoughtful-boot-6073496d2f.strapiapp.com"
const API_TOKEN =
  "34a3aff87085de1cc554e70babd81cf269080fa210ec4184537be072700ab025075b3e152e476a6eda74e583a5388d605820cd91cbb460972e3fb009cb0b8f67a4cd0639e7af3185b75f4ac3db0f2d114e0b61d7019901ad8120067e718b74880ba724a3e10e95667b29a629ae18c832cf344aedd60dae626707fd69245ab557"

async function testConnection() {
  try {
    console.log("🌐 Probando conexión con Strapi Cloud...")
    console.log("📡 URL:", STRAPI_URL)

    const response = await axios.get(`${STRAPI_URL}/api/safaris?locale=es`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`
      }
    })

    console.log("✅ ¡Conexión exitosa!")
    console.log(`📊 Safaris encontrados: ${response.data.data.length}`)

    if (response.data.data.length > 0) {
      console.log("🎯 Primer safari:", {
        title: response.data.data[0].title,
        locale: response.data.data[0].locale,
        code: response.data.data[0].code
      })
    }
  } catch (error) {
    console.error("❌ Error de conexión:")
    if (error.response) {
      console.error(`Status: ${error.response.status}`)
      console.error(`Data:`, error.response.data)
    } else {
      console.error(error.message)
    }
  }
}

testConnection()
