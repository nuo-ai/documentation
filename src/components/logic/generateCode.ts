import type { GlobalState } from "little-state-machine"

export default (formData: GlobalState["formData"]) => {
  return `import React from 'react';
import { useForm } from 'react-hook-form';

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
${
  Array.isArray(formData)
    ? formData.reduce(
        (
          previous,
          {
            type,
            name,
            required,
            max,
            min,
            maxLength,
            minLength,
            pattern,
            options,
          }
        ) => {
          const anyAttribute = [
            required,
            max,
            min,
            maxLength,
            minLength,
            pattern,
          ].some((value) => {
            if (typeof value === "boolean") return value
            return Boolean(value)
          })
          const ref = `{...register${
            required ? `("${name}", { required: true })` : `("${name}")`
          }}`
          if (type === "select") {
            const select = `      <select ${ref}>\n${(options || "")
              .split(";")
              .filter(Boolean)
              .reduce((temp, option) => {
                return (
                  temp +
                  `        <option value="${option}">${option}</option>\n`
                )
              }, "")}      </select>\n`

            return previous + select
          }

          if (type === "radio") {
            const select = `\n${(options || "")
              .split(";")
              .filter(Boolean)
              .reduce((temp, option) => {
                return (
                  temp +
                  `      <input ${ref} type="${type}" value="${option}" />\n`
                )
              }, "")}`

            return previous + select
          }

          let attributes = ""

          if (anyAttribute) {
            attributes += `("${name}", {`

            if (required) {
              attributes += "required: true"
            }
            if (max) {
              attributes += `${attributes === "({" ? "" : ", "}max: ${max}`
            }
            if (min) {
              attributes += `${attributes === "({" ? "" : ", "}min: ${min}`
            }
            if (minLength) {
              attributes += `${
                attributes === "({" ? "" : ", "
              }minLength: ${minLength}`
            }
            if (maxLength) {
              attributes += `${
                attributes === "({" ? "" : ", "
              }maxLength: ${maxLength}`
            }
            if (pattern) {
              attributes += `${
                attributes === "({" ? "" : ", "
              }pattern: /${pattern}/i`
            }

            attributes += "})"
          }

          const register = `{...register${attributes}}`

          if (type === "textarea") {
            const select = `      <textarea ${register} />\n`
            return previous + select
          }

          return (
            previous +
            `      <input type="${type}" placeholder="${name}" ${register} />\n`
          )
        },
        ""
      )
    : ""
}
      <input type="submit" />
    </form>
  );
}`
}
