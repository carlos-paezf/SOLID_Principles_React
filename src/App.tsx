// import SingleResponsibilityPrincipleOriginal from './SingleResponsibilityPrinciple/Original/index'
// import SingleResponsibilityPrincipleCorrected from './SingleResponsibilityPrinciple/Corrected/index'
// import OpenClosedPrincipleOriginal from './OpenClosedPrinciple/Original/index'
// import { TitleWithButton, TitleWithLink } from './OpenClosedPrinciple/Corrected'
// import { BadImplementation } from './LiskovSubstitutionPrinciple/bad-implementation'
// import { BestPractice } from './LiskovSubstitutionPrinciple/best-practice'
// import Post from "./InterfaceSegregationPrinciple/Original"
// import Post from "./InterfaceSegregationPrinciple/Corrected"
// import Todo from "./DependencyInversionPrinciple/Original"

import Todo from "./DependencyInversionPrinciple/Corrected"



function App () {
    return (
        <>
            {/* Principio de responsabilidad única */ }
            {/* <SingleResponsibilityPrincipleOriginal /> */ }
            {/* <SingleResponsibilityPrincipleCorrected /> */ }

            {/* Principio de abierto cerrado */ }
            {/* <OpenClosedPrincipleOriginal title='Prueba' type='withNormalButton' buttonText='Botón' /> */ }
            {/* <TitleWithButton title='Botón' buttonText='Botón' onClick={() => null} /> */ }
            {/* <TitleWithLink title='Link' buttonText='Link' href='/' /> */ }

            {/* Principio de sustitución de Liskov */ }
            {/* <BadImplementation /> */ }
            {/* <BestPractice /> */ }

            {/* Principio de segregación de interfaz */ }
            {/* <Post post={ {
                author: {
                    name: "Carlos Páez",
                    age: 21
                },
                title: "Prueba de Post",
                createdAt: new Date()
            } } /> */}

            {/* Principio de inversión de dependencias */ }
            <Todo />
        </>
    )
}

export default App
