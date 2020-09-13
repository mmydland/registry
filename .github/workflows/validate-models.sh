for f in "$@"
do
    if [[ $f == *"dtmi/"* ]]
    then
        dtdl2-validator /f=$f /resolver=local
        echo $?
        if [ $? -neq 0 ]
        then
            echo "error validating model"
            exit 1
        else
            echo "validation ok"
        fi
    fi
done
