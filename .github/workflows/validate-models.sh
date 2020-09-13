for f in "$@"
do
    if [[ $f == *"dtmi/"* ]]
    then
        dtdl2-validator /f=$f /resolver=local
        if [ $? -neq 0 ]
        then
            exit 1
        fi
    fi
done
