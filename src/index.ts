import render from "./renderer";

console.log(render(`
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
`));
