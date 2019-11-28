import render from "./renderer";

const samplePrograms = {
    each: `
        each $p : $f <span> $p </span>
    `,
    tag: `
        <span> "Text" </span>
    `,
    advanced: `
        component "SampleComponent" <div>
            "Hello"
        </div>
    
        component "SampleComponent2" <span>
            "Hello"
        </span>
    
        "Literal" #SampleComponent#
            "Sample Component"
    
            #SampleComponent2#
                "Sample Component 2"
            #!SampleComponent2#
        #!SampleComponent#
    `,
    complex: `
        import "./list";
    
        component "sample" #a#
            #b!#
    
            each $f: $G #List#
                $f
            #!List#
    
            #c#
                #d!#
    
                "Hello World"
    
                #e#
                    #f!#
                #!e#
            #!c#
        #!a#
    
        each $p: $F #List#
            "Hello" $p
        #!List#
    
        #List#
            "hi"
        #!List#
    `
};

render(samplePrograms.each);
