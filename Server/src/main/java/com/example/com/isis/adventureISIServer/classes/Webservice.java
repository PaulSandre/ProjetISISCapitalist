/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.com.isis.adventureISIServer.classes;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.JAXBException;

/**
 *
 * @author psandre
 */
@Path("generic")
public class Webservice {

    Services services;

    public Webservice() {
        services = new Services();
    }

    @GET
    @Path("world")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Response getXml(@Context HttpServletRequest request) throws JAXBException, IOException {
        String username = request.getHeader("X-User");
        return Response.ok(services.getWorld(username)).build();
    }

    @PUT
    @Path("product")
    public void putProduct(@Context HttpServletRequest request, ProductType product) throws JAXBException, IOException {
        String username = request.getHeader("X-user");
        services.updateProduct(username, product);
    }

    @PUT
    @Path("manager")
    public void putManager(@Context HttpServletRequest request, PallierType manager) throws JAXBException, IOException {
        String username = request.getHeader("X-user");
        services.updateManager(username, manager);
    }

    @PUT
    @Path("upgrade")
    public void putUpgrade(@Context HttpServletRequest request, PallierType upgrade) throws JAXBException, IOException {
        String username = request.getHeader("X-user");
        services.updateUpgrade(username, upgrade);
    }
    
    @PUT
    @Path("upgradeAngel")
    public void putUpgradeAngel(@Context HttpServletRequest request, PallierType upgradeAngel) throws JAXBException, IOException {
        String username = request.getHeader("X-user");
        services.updateUpgradeAngel(username, upgradeAngel);
        System.out.println("PUT ANGEL");
    }

    @DELETE
    @Path("world")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void deleteWorld(@Context HttpServletRequest request) throws JAXBException, IOException {
        String username = request.getHeader("X-User");
        //System.out.println("username delete : "+username);
        services.deleteWorld(username);
    }

}
