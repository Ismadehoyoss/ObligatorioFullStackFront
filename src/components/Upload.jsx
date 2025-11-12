import { useState } from "react";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

const schema = Joi.object({
  image: Joi.any()
    .required()
    .custom((value, helpers) => {
      if (!value || value.length === 0) {
        return helpers.error("any.required");
      }
      const file = value[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return helpers.error("any.invalid");
      }
      if (file.size > 2 * 1024 * 1024) {
        // Máx 2 MB
        return helpers.error("any.max");
      }
      return value;
    })
    .messages({
      "any.required": "La imagen es obligatoria",
      "any.invalid": "Solo se permiten JPG, PNG o WEBP",
      "any.max": "La imagen no puede superar los 2MB",
    }),
});

const Upload = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setUrl("");

    const file = data.image[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "XXXXXXXXXXXX"); // preset unsigned
    formData.append("cloud_name", "XXXXXXXXXXXX"); // cloud name

    //Cloud name en la URL
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/XXXXXXX/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploaded = await res.json();
      setUrl(uploaded.secure_url);
      reset();
    } catch (err) {
      console.error("Error al subir imagen:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Subir imagen a Cloudinary</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" {...register("image")} />
        {errors.image && (
          <p style={{ color: "red" }}>{errors.image.message}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Subiendo..." : "Subir"}
        </button>
      </form>

      {url && (
        <div style={{ marginTop: 20 }}>
          <h4>Imagen subida:</h4>
          <img 
            src={url.replace('/upload/', '/upload/c_scale,w_300/f_auto/q_auto/')} 
            alt="upload" 
            width="300" 
          />
          <p>URL original: <a href={url} target="_blank" rel="noopener noreferrer">Ver imagen completa</a></p>
        </div>
      )}
    </div>
  );
}

export default Upload;