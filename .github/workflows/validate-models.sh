for f in "$@"
do
    if [[ $f == *"dtmi/"* ]]
    then
        dtdl2-validator /f=$f /resolver=local
        echo $?
        if [ $? -eq 0 ]
        then
            echo "validation ok"
        else
            echo "error validating model"
            exit 1
        fi
    fi
done
